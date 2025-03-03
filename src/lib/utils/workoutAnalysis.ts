import { differenceInDays, differenceInWeeks } from 'date-fns'

export type Recommendation = {
  exercise?: string
  type: string
  current?: number | string[]
  target?: number | string[] | SetScheme
  message: string
  groups?: string[]
  alternatives?: string[]
  suggested?: string[]
  muscle?: string
  suggestions?: Array<{
    replace: string
    with: string
    reason: string
  }>
}

type SetScheme = {
  sets: number
  reps: string
  description: string
}

export function calculateFrequencyStats(workouts: any[]) {
  const totalWorkouts = workouts.length
  const firstWorkoutDate = new Date(workouts[workouts.length - 1]?.date || new Date())
  const lastWorkoutDate = new Date(workouts[0]?.date || new Date())
  const weekCount = Math.max(1, differenceInWeeks(lastWorkoutDate, firstWorkoutDate))
  const averagePerWeek = totalWorkouts / weekCount

  // Count muscle group frequency
  const muscleGroupCounts = workouts.reduce((acc, workout) => {
    workout.muscle_group.split(',').forEach((group: string) => {
      const trimmedGroup = group.trim()
      acc[trimmedGroup] = (acc[trimmedGroup] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Sort by frequency
  const mostFrequentMuscleGroups = Object.entries(muscleGroupCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([group]) => group)

  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(workouts.map(w => w.date))

  return {
    totalWorkouts,
    averagePerWeek,
    mostFrequentMuscleGroups,
    consistencyScore
  }
}

function calculateConsistencyScore(workout_dates: string[]) {
  if (workout_dates.length < 2) return 0
  
  let score = 0
  let maxScore = (workout_dates.length - 1) * 2 // Maximum possible score
  
  for (let i = 1; i < workout_dates.length; i++) {
    const daysBetween = differenceInDays(
      new Date(workout_dates[i-1]),
      new Date(workout_dates[i])
    )
    score += daysBetween <= 2 ? 2 : daysBetween <= 4 ? 1 : 0
  }

  // Return normalized score (0-100)
  return Math.round((score / maxScore) * 100)
}

export function calculateProgressStats(workouts: any[]) {
  const exerciseProgress: Record<string, {
    maxWeight: number
    volumeProgress: number
    lastUsed: string
    trend: 'increasing' | 'decreasing' | 'neutral'
    history: Array<{ date: string; weight: number; volume: number }>
  }> = {}

  // Process each workout
  workouts.forEach(workout => {
    workout.exercises.forEach((exercise: any) => {
      if (!exerciseProgress[exercise.name]) {
        exerciseProgress[exercise.name] = {
          maxWeight: 0,
          volumeProgress: 0,
          lastUsed: workout.date,
          trend: 'neutral',
          history: []
        }
      }

      const totalVolume = exercise.exercise_sets.reduce((total: number, set: any) => {
        const mainVolume = (Number(set.weight) || 0) * (Number(set.reps) || 0)
        const dropsetVolume = set.is_dropset 
          ? (Number(set.dropset_weight) || 0) * (Number(set.dropset_reps) || 0)
          : 0
        return total + mainVolume + dropsetVolume
      }, 0)

      const maxSetWeight = Math.max(
        ...exercise.exercise_sets.map((set: any) => 
          Math.max(Number(set.weight) || 0, Number(set.dropset_weight) || 0)
        )
      )

      exerciseProgress[exercise.name].history.push({
        date: workout.date,
        weight: maxSetWeight,
        volume: totalVolume
      })

      exerciseProgress[exercise.name].maxWeight = Math.max(
        exerciseProgress[exercise.name].maxWeight,
        maxSetWeight
      )
    })
  })

  // Calculate progress trends and volume progress
  Object.keys(exerciseProgress).forEach(exerciseName => {
    const history = exerciseProgress[exerciseName].history
    if (history.length >= 2) {
      const firstVolume = history[history.length - 1].volume
      const lastVolume = history[0].volume
      exerciseProgress[exerciseName].volumeProgress = 
        ((lastVolume - firstVolume) / firstVolume) * 100

      // Calculate trend based on recent workouts
      const recentWorkouts = history.slice(0, Math.min(3, history.length))
      const trend = recentWorkouts.every((workout, i) => 
        i === 0 || workout.volume <= recentWorkouts[i - 1].volume
      ) ? 'decreasing' : 'increasing'
      
      exerciseProgress[exerciseName].trend = trend
    }
  })

  // Identify consistent exercises and those needing attention
  const consistentExercises = Object.entries(exerciseProgress)
    .filter(([_, data]) => data.history.length >= 3 && data.volumeProgress > 0)
    .map(([name]) => name)
    .slice(0, 5)

  const needsAttention = Object.entries(exerciseProgress)
    .filter(([_, data]) => 
      data.history.length >= 2 && 
      (data.volumeProgress < 0 || data.trend === 'decreasing')
    )
    .map(([name]) => name)
    .slice(0, 3)

  return {
    exerciseProgress,
    consistentExercises,
    needsAttention
  }
}

export function calculateStrengthProgressionTimeline(
  currentWeight: number,
  exerciseHistory: Array<{ date: string }>
): { targetWeight: number; timeframe: string } {
  // Calculate training frequency for this exercise
  const trainingFrequency = exerciseHistory.length / 12 // Average sessions per week (assuming 3 months data)
  
  // Base progression on weight and frequency
  let weeksTillProgress: number
  if (currentWeight < 50) {
    weeksTillProgress = trainingFrequency >= 2 ? 1 : 2 // Beginners can progress weekly/bi-weekly
  } else if (currentWeight < 100) {
    weeksTillProgress = trainingFrequency >= 2 ? 2 : 3 // Intermediate needs more time
  } else {
    weeksTillProgress = trainingFrequency >= 2 ? 3 : 4 // Advanced lifts need more recovery
  }

  // Calculate target weight (rounded to nearest 2.5kg)
  const progressionRate = currentWeight < 50 ? 0.05 : // 5% for beginners
                         currentWeight < 100 ? 0.025 : // 2.5% intermediate
                         0.015; // 1.5% for advanced
  
  const increase = currentWeight * progressionRate
  const targetWeight = Math.round((currentWeight + increase) / 2.5) * 2.5

  // Generate timeframe message
  const timeframe = weeksTillProgress === 1 ? "next session" :
                   weeksTillProgress === 2 ? "within 2 weeks" :
                   weeksTillProgress === 3 ? "within 3 weeks" : "within a month"

  return { targetWeight, timeframe }
}

function getRecentMuscleGroups(workouts: any[], daysThreshold = 30) {
  const now = new Date()
  const recentWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date)
    const daysDiff = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= daysThreshold
  })

  return Array.from(new Set(recentWorkouts.map(w => w.muscle_group.split(',').map((g: string) => g.trim())).flat()))
}

// Make MUSCLE_GROUPS exportable
export const MUSCLE_GROUPS = [
  'Back',
  'Bicep',
  'Shoulder',
  'Legs',
  'Tricep',
  'Chest',
  'Core'
] as const;

export function generateRecommendations(
  frequencyStats: ReturnType<typeof calculateFrequencyStats>,
  progressStats: ReturnType<typeof calculateProgressStats>,
  workouts: any[],
  exerciseLibrary: Record<string, { muscle_group: string }>
) {
  const recommendations = {
    priority: [] as Recommendation[],
    frequency: [] as Recommendation[],
    variety: [] as Recommendation[]
  }

  // Analyze exercise selection patterns
  const exercisePatterns = analyzeExercisePatterns(workouts)
  const muscleGroupBalance = analyzeMuscleGroupBalance(workouts)
  
  // Priority: Exercise-specific recommendations
  Object.entries(progressStats.exerciseProgress).forEach(([name, exercise]) => {
    // Plateau detection
    const plateauStatus = detectPlateau(exercise.history, 'compound')
    if (plateauStatus.type !== 'none') {
      const alternativeExercises = getAlternativeExercises(name, exerciseLibrary[name]?.muscle_group || 'Other')
      recommendations.priority.push({
        exercise: name,
        type: 'plateau',
        current: exercise.maxWeight,
        target: exercise.maxWeight * 1.1,
        message: `You've plateaued on ${name}. Try these alternatives to break through:`,
        alternatives: alternativeExercises
      })
    }

    // Volume optimization
    if (exercise.volumeProgress < 0) {
      const optimalSets = calculateOptimalSets(exercise.history)
      recommendations.priority.push({
        exercise: name,
        type: 'volume',
        current: Math.round(exercise.history[0]?.volume / exercise.history[0]?.weight) || 0,
        target: optimalSets,
        message: `Optimize ${name} by adjusting your set/rep scheme: ${optimalSets.description}`
      })
    }
  })

  // Frequency: Personalized schedule optimization
  const workoutPattern = analyzeWorkoutPattern(workouts)
  if (workoutPattern.gaps.length > 0) {
    recommendations.frequency.push({
      type: 'schedule',
      current: workoutPattern.currentDays,
      suggested: workoutPattern.suggestedDays,
      message: `Based on your schedule, you could optimize by moving ${workoutPattern.currentDays[0]} workout to ${workoutPattern.suggestedDays[0]} for better recovery`
    })
  }

  // Variety: Smart exercise rotation
  const muscleImbalances = findMuscleImbalances(muscleGroupBalance)
  muscleImbalances.forEach(imbalance => {
    recommendations.variety.push({
      type: 'balance',
      muscle: imbalance.muscle,
      message: `Your ${imbalance.muscle} development could be enhanced by:`,
      suggestions: [
        {
          replace: imbalance.overused[0],
          with: imbalance.recommended[0],
          reason: `Better activation and range of motion`
        }
      ]
    })
  })

  return recommendations
}

interface ExerciseHistory {
  date: string;
  weight: number;
  volume: number;
}

interface WorkoutPattern {
  gaps: number[];
  currentDays: string[];
  suggestedDays: string[];
}

interface MuscleImbalance {
  muscle: string;
  overused: string[];
  recommended: string[];
  ratio: number;
}

function analyzeExercisePatterns(workouts: any[]): Record<string, number> {
  return workouts.reduce((patterns, workout) => {
    workout.exercises.forEach((exercise: any) => {
      patterns[exercise.name] = (patterns[exercise.name] || 0) + 1;
    });
    return patterns;
  }, {});
}

export type PlateauType = 'none' | 'short' | 'medium' | 'long' | 'regression';

export interface PlateauStatus {
  type: PlateauType;
  duration: number; // Number of workouts in plateau
  severity: 'warning' | 'concern' | 'critical';
  message: string;
  color: string;
  recommendation: string;
}

export function detectPlateau(
  exerciseHistory: Array<{
    date: string;
    weight: number;
    volume: number;
  }>,
  exerciseType: 'compound' | 'isolation' = 'compound'
): PlateauStatus {
  // Keep minimum workout requirement at 3
  if (exerciseHistory.length < 3) {
    return {
      type: 'none',
      duration: 0,
      severity: 'warning',
      message: 'Not enough data to detect plateau',
      color: 'text-gray-500',
      recommendation: 'Continue training consistently to track progress'
    };
  }

  const sortedHistory = [...exerciseHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Increase sample size to 8 workouts for better trend analysis
  const recentWorkouts = sortedHistory.slice(0, 8);
  
  // Calculate both weight and volume changes
  const weightChanges = recentWorkouts.map((workout, i) => {
    if (i === recentWorkouts.length - 1) return 0;
    return ((workout.weight - recentWorkouts[i + 1].weight) / recentWorkouts[i + 1].weight) * 100;
  });

  const volumeChanges = recentWorkouts.map((workout, i) => {
    if (i === recentWorkouts.length - 1) return 0;
    return ((workout.volume - recentWorkouts[i + 1].volume) / recentWorkouts[i + 1].volume) * 100;
  });

  // More realistic thresholds based on exercise type
  const thresholds = exerciseType === 'compound' ? {
    weight: 2.0,  // 2% for compound movements
    volume: 5.0   // 5% for volume
  } : {
    weight: 3.0,  // 3% for isolation exercises
    volume: 7.0   // 7% for volume
  };

  // Short-term plateau (3-4 workouts) - Early warning
  const isShortPlateau = weightChanges.slice(0, 4).every(change => 
    Math.abs(change) < thresholds.weight
  );

  // Medium-term plateau (5-6 workouts) - Needs attention
  const isMediumPlateau = weightChanges.slice(0, 6).every(change => 
    Math.abs(change) < thresholds.weight
  ) && volumeChanges.slice(0, 6).every(change => change < thresholds.volume);

  // Long-term plateau (7+ workouts) - Critical attention needed
  const isLongPlateau = weightChanges.slice(0, 8).every(change => 
    Math.abs(change) < thresholds.weight
  ) && volumeChanges.slice(0, 8).every(change => change < thresholds.volume);

  // Check for regression (negative progress)
  const isRegressing = weightChanges.slice(0, 4).every(change => change < 0) ||
    volumeChanges.slice(0, 4).every(change => change < -thresholds.volume);

  if (isRegressing) {
    return {
      type: 'regression',
      duration: 4,
      severity: 'critical',
      message: 'Performance Declining',
      color: 'text-red-600 bg-red-50',
      recommendation: exerciseType === 'compound'
        ? 'Deload by 10% and rebuild with focus on form. Consider recording your sets.'
        : 'Reset weight to where form is perfect. Focus on mind-muscle connection.'
    };
  }

  if (isLongPlateau) {
    return {
      type: 'long',
      duration: 8,
      severity: 'critical',
      message: 'Significant Plateau',
      color: 'text-red-600 bg-red-50',
      recommendation: exerciseType === 'compound'
        ? 'Time for a deload week. Reduce weight by 40% and focus on explosive power.'
        : 'Switch to an alternative exercise for 2-3 weeks to break through.'
    };
  }

  if (isMediumPlateau) {
    return {
      type: 'medium',
      duration: 6,
      severity: 'concern',
      message: 'Progress Stalling',
      color: 'text-amber-600 bg-amber-50',
      recommendation: exerciseType === 'compound'
        ? 'Try varying rep ranges or add pause reps to increase time under tension.'
        : 'Add drop sets or decrease rest periods to increase intensity.'
    };
  }

  if (isShortPlateau) {
    return {
      type: 'short',
      duration: 4,
      severity: 'warning',
      message: 'Progress Slowing',
      color: 'text-blue-600 bg-blue-50',
      recommendation: 'Review nutrition and recovery. Consider tracking protein intake.'
    };
  }

  return {
    type: 'none',
    duration: 0,
    severity: 'warning',
    message: 'Progress On Track',
    color: 'text-green-600 bg-green-50',
    recommendation: 'Keep up the consistent progress!'
  };
}

// Helper function to get the visual style based on plateau severity
export function getPlateauStyle(status: PlateauStatus) {
  switch (status.severity) {
    case 'critical':
      return {
        badge: 'bg-red-100 text-red-800 border-red-200',
        icon: 'text-red-500',
        alert: 'bg-red-50 border-red-200',
      };
    case 'concern':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'text-amber-500',
        alert: 'bg-amber-50 border-amber-200',
      };
    case 'warning':
      return {
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'text-blue-500',
        alert: 'bg-blue-50 border-blue-200',
      };
    default:
      return {
        badge: 'bg-green-100 text-green-800 border-green-200',
        icon: 'text-green-500',
        alert: 'bg-green-50 border-green-200',
      };
  }
}

export function getAlternativeExercises(exercise: string, muscleGroup: string): string[] {
  // Map of exercise alternatives by muscle group
  const alternatives: Record<string, Record<string, string[]>> = {
    'Chest': {
      'Bench Press': ['Incline Bench Press', 'Dumbbell Press', 'Floor Press'],
      'Incline Bench Press': ['Bench Press', 'Decline Bench Press', 'Dumbbell Incline Press'],
      // Add more chest exercises
    },
    'Back': {
      'Barbell Row': ['Pendlay Row', 'T-Bar Row', 'Meadows Row'],
      'Pull Up': ['Chin Up', 'Lat Pulldown', 'Neutral Grip Pull Up'],
      // Add more back exercises
    },
    // Add more muscle groups
  };

  // Return alternatives if they exist, otherwise empty array
  return alternatives[muscleGroup]?.[exercise] || [];
}

export function calculateOptimalSets(history: ExerciseHistory[]) {
  if (history.length < 2) return { sets: 3, reps: '8-12', description: 'Start with 3 sets of 8-12 reps' };

  const averageVolume = history.reduce((sum, h) => sum + h.volume, 0) / history.length;
  const trend = history[0].volume - history[history.length - 1].volume;

  if (trend > 0) {
    return {
      sets: 4,
      reps: '6-8',
      description: 'Progress to 4 sets of 6-8 reps to focus on strength'
    };
  } else {
    return {
      sets: 3,
      reps: '12-15',
      description: 'Switch to 3 sets of 12-15 reps to break through plateau'
    };
  }
}

function analyzeMuscleGroupBalance(workouts: any[]): Record<string, number> {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  return workouts
    .filter(w => new Date(w.date) >= last30Days)
    .reduce((balance, workout) => {
      const groups = workout.muscle_group.split(',').map((g: string) => g.trim());
      groups.forEach((group: string) => {
        balance[group] = (balance[group] || 0) + 1;
      });
      return balance;
    }, {});
}

function findMuscleImbalances(balance: Record<string, number>): MuscleImbalance[] {
  const imbalances: MuscleImbalance[] = [];
  const idealRatio = 1; // Equal training frequency for all muscle groups

  MUSCLE_GROUPS.forEach(muscle => {
    const frequency = balance[muscle] || 0;
    const averageFrequency = Object.values(balance).reduce((sum, val) => sum + val, 0) / 
                            Object.keys(balance).length;
    
    if (frequency / averageFrequency < idealRatio * 0.7) { // Under-trained muscle group
      imbalances.push({
        muscle,
        overused: [], // Will be filled based on exercise library
        recommended: [], // Will be filled based on exercise library
        ratio: frequency / averageFrequency
      });
    }
  });

  return imbalances;
}

function analyzeWorkoutPattern(workouts: any[]): WorkoutPattern {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const recentWorkouts = workouts
    .filter(w => new Date(w.date) >= last30Days)
    .map(w => new Date(w.date).getDay());

  const currentDays = Array.from(new Set(recentWorkouts)).sort();
  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const gaps = allDays.filter(day => !currentDays.includes(day));
  
  // Suggest optimal days based on current pattern
  const suggestedDays = gaps.filter(gap => {
    const hasAdjacentWorkout = currentDays.some(day => 
      Math.abs(day - gap) === 1 || Math.abs(day - gap) === 6
    );
    return !hasAdjacentWorkout;
  });

  return {
    gaps: allDays.filter(day => !currentDays.includes(day)),
    currentDays: currentDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]),
    suggestedDays: suggestedDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
  };
}

export interface ExercisePlateau {
  exerciseName: string;
  status: PlateauStatus;
  exerciseType: 'compound' | 'isolation';
  frequency: number; // Number of times performed in last 30 days
}

export type PlateauRecommendation = {
  general: string;
  technique: string;
  volume: string;
  alternative: string;
}

const PLATEAU_RECOMMENDATIONS: Record<string, PlateauRecommendation> = {
  // Back Exercises
  'Assisted Pull-ups': {
    general: "Your assisted pull-up progress has stalled. Time to reduce assistance.",
    technique: "Focus on full range of motion and controlled negative phase.",
    volume: "Gradually decrease assistance weight by 2-3kg each successful session.",
    alternative: "Try negative pull-ups or inverted rows to build strength."
  },
  'Barbell Rows': {
    general: "Your barbell row progress has plateaued. Let's optimize your pulling power.",
    technique: "Keep your core tight and maintain a 45-degree torso angle throughout.",
    volume: "Add two lighter back-off sets with strict form after your working sets.",
    alternative: "Implement Pendlay rows or single-arm dumbbell rows for variety."
  },
  'Deadlifts': {
    general: "Your deadlift has stalled. This key movement needs strategic progression.",
    technique: "Focus on leg drive and maintaining a neutral spine throughout the pull.",
    volume: "Try 5x3 with 75% 1RM, focusing on explosive concentric phase.",
    alternative: "Incorporate deficit deadlifts or rack pulls to target weak points."
  },
  'Lat Pulldowns': {
    general: "Your lat pulldown progress has plateaued. Let's improve mind-muscle connection.",
    technique: "Drive elbows down and back, focusing on lat engagement rather than weight.",
    volume: "Implement drop sets on your last two sets to increase time under tension.",
    alternative: "Try close-grip pulldowns or straight-arm pulldowns for variation."
  },
  'Pull-Ups': {
    general: "Your pull-up progress has stalled. Let's break through this ceiling.",
    technique: "Initiate each rep from a dead hang with engaged shoulders.",
    volume: "Add weighted sets if doing more than 8 reps, or focus on perfect singles.",
    alternative: "Mix in weighted negatives or band-assisted volume sets."
  },
  'Seated Cable Rows': {
    general: "Your cable row progress has plateaued. Focus on quality contractions.",
    technique: "Keep chest up and pull to lower sternum, squeezing at peak contraction.",
    volume: "Try alternating between heavy (6-8) and light (12-15) rep ranges.",
    alternative: "Implement wide-grip rows or face pulls for upper back emphasis."
  },
  'Shrugs': {
    general: "Your shrug progression has stalled. Let's target those traps effectively.",
    technique: "Focus on vertical movement only, avoid rolling shoulders.",
    volume: "Try high-volume (15-20 reps) with perfect form and peak holds.",
    alternative: "Include behind-the-back barbell shrugs or farmer's walks."
  },
  'Single Arm Lat Pulldown': {
    general: "Your single-arm pulldown progress has plateaued.",
    technique: "Maintain stable core and avoid leaning or twisting.",
    volume: "Add pause reps at peak contraction every other session.",
    alternative: "Try straight-arm pulldowns or meadows rows for variation."
  },

  // Bicep Exercises
  'Barbell Curls': {
    general: "Your barbell curl progress has stalled. Let's refine your technique.",
    technique: "Keep elbows pinned to sides and minimize body swing.",
    volume: "Implement 21s method or reverse pyramid training.",
    alternative: "Try EZ-bar curls or spider curls for variety."
  },
  'Bicep Curl - Cable': {
    general: "Your cable curl progress needs a boost. Focus on constant tension.",
    technique: "Maintain tension throughout, especially at the bottom.",
    volume: "Add drop sets or try ascending/descending rep patterns.",
    alternative: "Mix in single-arm cable preacher curls or high-pulley curls."
  },
  'Bicep Curl - Dumbbell': {
    general: "Your dumbbell curl progress has plateaued. Let's optimize tension.",
    technique: "Focus on supination at the top of each rep.",
    volume: "Alternate between standing and seated variations each session.",
    alternative: "Try incline bench curls or hammer curls for new stimulus."
  },
  'Chin-Ups': {
    general: "Your chin-up progress has stalled. Time to mix up the stimulus.",
    technique: "Focus on full range of motion and controlled negatives.",
    volume: "Add weight if doing more than 10 reps, or increase total sets.",
    alternative: "Include neutral grip pull-ups or assisted volume sets."
  },
  'Concentration Curls': {
    general: "Your concentration curl progress needs attention.",
    technique: "Keep elbow firmly planted and focus on peak contraction.",
    volume: "Try rest-pause sets or double drop sets for intensity.",
    alternative: "Implement preacher curls or spider curls for similar isolation."
  },
  'Ez-Bar Bicep Curl': {
    general: "Your EZ-bar curl progression has plateaued.",
    technique: "Maintain strict form with elbows at sides throughout.",
    volume: "Try 4 sets: 12,10,8,15 reps with increasing weight.",
    alternative: "Include close-grip and wide-grip variations."
  },
  'Hammer Curls': {
    general: "Your hammer curl progress needs a new approach.",
    technique: "Keep wrists neutral and elbows steady throughout movement.",
    volume: "Alternate between seated and standing sets for variety.",
    alternative: "Try cross-body hammer curls or rope hammer curls."
  },
  'Preacher Curls': {
    general: "Your preacher curl progress has stalled. Focus on form.",
    technique: "Maintain contact with pad and focus on negative phase.",
    volume: "Implement single-arm focus sets after bilateral work.",
    alternative: "Try spider curls or concentration curls for similar isolation."
  },

  // Chest Exercises
  'Bench Press - Barbell': {
    general: "Your bench press has plateaued. Let's break through systematically.",
    technique: "Focus on leg drive and proper scapular retraction.",
    volume: "Try 5x5 with last set AMRAP, or implement joker sets.",
    alternative: "Include close-grip bench or floor press variations."
  },
  'Bench Press - Dumbbell': {
    general: "Your dumbbell bench progress needs attention.",
    technique: "Control the weights through full ROM, especially at bottom.",
    volume: "Alternate between flat and slight incline positions.",
    alternative: "Try neutral grip or alternating press variations."
  },
  'Cable Flyes': {
    general: "Your cable fly progress has stalled. Focus on quality contractions.",
    technique: "Maintain slight elbow bend and focus on chest squeeze.",
    volume: "Implement high-rep finishers or drop sets for pump.",
    alternative: "Try high-to-low or low-to-high variations."
  },
  'Decline Bench Press': {
    general: "Your decline bench progress needs a boost.",
    technique: "Keep shoulders packed and focus on lower chest engagement.",
    volume: "Try reverse pyramid training: heavy to light sets.",
    alternative: "Include flat bench or weighted dips for variety."
  },
  'Dumbbell Flyes': {
    general: "Your dumbbell fly progress has plateaued.",
    technique: "Maintain slight elbow bend throughout the movement.",
    volume: "Focus on slower negatives and controlled reps.",
    alternative: "Try cable flyes or pec deck for constant tension."
  },
  'Incline Bench Press': {
    general: "Your incline press has stalled. Let's target upper chest effectively.",
    technique: "Focus on proper bar path and upper chest engagement.",
    volume: "Try varying incline angles and rep ranges each session.",
    alternative: "Include landmine press or incline dumbbell work."
  },
  'Push-Ups': {
    general: "Your push-up progression needs advancement.",
    technique: "Keep core tight and maintain proper elbow angle.",
    volume: "Add weight via plate/vest or increase rep quality.",
    alternative: "Try diamond push-ups or decline variations."
  },

  // Core Exercises
  'Ab Roller': {
    general: "Your ab roller progress has plateaued. Let's increase difficulty.",
    technique: "Focus on hip position and maintaining neutral spine.",
    volume: "Add hold at full extension or increase roll-out distance.",
    alternative: "Try standing ab rollouts or plank variations."
  },
  'Crunches': {
    general: "Your crunch progression needs variation.",
    technique: "Focus on upper spine flexion, avoid neck strain.",
    volume: "Implement slow negatives and pause reps.",
    alternative: "Try reverse crunches or cable crunches for progression."
  },
  'Leg Raises': {
    general: "Your leg raise progress has stalled.",
    technique: "Keep lower back pressed down throughout movement.",
    volume: "Add ankle weights or implement hanging variations.",
    alternative: "Try reverse crunches or dragon flags."
  },
  'Planks': {
    general: "Your plank endurance has plateaued.",
    technique: "Maintain perfect alignment from head to heels.",
    volume: "Add weight or implement movement variations.",
    alternative: "Try RKC planks or dynamic plank movements."
  },
  'Russian Twists': {
    general: "Your Russian twist progression needs attention.",
    technique: "Keep chest up and focus on rotation quality.",
    volume: "Increase weight or add pause at each side.",
    alternative: "Try cable woodchops or Pallof presses."
  },

  // Legs Exercises
  'Box Jumps': {
    general: "Your box jump progress needs advancement.",
    technique: "Focus on explosive power and soft landing.",
    volume: "Increase box height or add complex variations.",
    alternative: "Try depth jumps or broad jumps for power development."
  },
  'Bulgarian Split Squat': {
    general: "Your split squat progress has stalled.",
    technique: "Maintain vertical shin angle and upright torso.",
    volume: "Try 3 sets per leg: heavy(6), medium(8), light(12).",
    alternative: "Include regular split squats or step-ups."
  },
  'Cable Kickbacks': {
    general: "Your kickback progression needs attention.",
    technique: "Keep core engaged and minimize lower back arch.",
    volume: "Add pulse reps or implement drop sets.",
    alternative: "Try hip thrusts or glute bridges for variation."
  },
  'Calf Raises': {
    general: "Your calf raise progress has plateaued.",
    technique: "Full range of motion with pause at bottom.",
    volume: "Mix seated and standing variations with high volume.",
    alternative: "Try single-leg or donkey calf raises."
  },
  'Hamstring Curl': {
    general: "Your hamstring curl progress needs a boost.",
    technique: "Focus on controlled negatives and peak contraction.",
    volume: "Implement single-leg focus sets after bilateral work.",
    alternative: "Try stiff-leg deadlifts or Good Mornings."
  },
  'Hip Thrusts': {
    general: "Your hip thrust progression has stalled.",
    technique: "Focus on full glute contraction at top position.",
    volume: "Add pause reps or implement banded variation.",
    alternative: "Try single-leg thrusts or glute bridges."
  },
  'Leg Extensions': {
    general: "Your leg extension progress needs attention.",
    technique: "Focus on quad contraction and controlled negatives.",
    volume: "Try drop sets or rest-pause sets for intensity.",
    alternative: "Include sissy squats or front squats for quad focus."
  },
  'Leg Press': {
    general: "Your leg press has plateaued. Let's optimize loading.",
    technique: "Keep lower back pressed against seat throughout.",
    volume: "Try varying foot positions and rep ranges.",
    alternative: "Include hack squats or belt squats."
  },
  'Lunges': {
    general: "Your lunge progression needs advancement.",
    technique: "Maintain vertical shin and control descent.",
    volume: "Add weight or implement walking variations.",
    alternative: "Try reverse lunges or split squats."
  },
  'RDL - Romanian Deadlift': {
    general: "Your RDL progress has stalled. Focus on hamstring tension.",
    technique: "Keep bar close to legs and hinge at hips.",
    volume: "Try 4x8 with slow negatives and perfect form.",
    alternative: "Include single-leg RDLs or Good Mornings."
  },
  'Single-Leg Squat': {
    general: "Your single-leg squat needs progression.",
    technique: "Control knee tracking and maintain balance.",
    volume: "Focus on quality reps before adding weight.",
    alternative: "Try Bulgarian split squats or step-ups."
  },
  'Squats': {
    general: "Your squat has plateaued. Let's break this systematically.",
    technique: "Focus on bracing and maintaining bar path.",
    volume: "Implement 5/3/1 progression or volume waves.",
    alternative: "Include front squats or pause squats."
  },

  // Shoulder Exercises
  'Face Pulls': {
    general: "Your face pull progress needs attention.",
    technique: "Pull to forehead and focus on external rotation.",
    volume: "Higher reps (15-20) with perfect form.",
    alternative: "Try reverse flyes or band pull-aparts."
  },
  'Front Raises': {
    general: "Your front raise progression has stalled.",
    technique: "Control the movement and avoid momentum.",
    volume: "Try alternating arms and varying rep ranges.",
    alternative: "Include plate raises or landmine presses."
  },
  'Lateral Raises': {
    general: "Your lateral raise progress needs a boost.",
    technique: "Lead with elbows and control the negative.",
    volume: "Implement partial reps or drop sets.",
    alternative: "Try cable lateral raises or upright rows."
  },
  'Rear Delt Flyes': {
    general: "Your rear delt development has plateaued.",
    technique: "Keep chest supported and elbows high.",
    volume: "High volume (15-20 reps) with strict form.",
    alternative: "Try face pulls or reverse pec deck."
  },
  'Shoulder Press - Barbell': {
    general: "Your overhead press has stalled.",
    technique: "Stack joints and maintain full-body tension.",
    volume: "Try 5x5 or implement push press variations.",
    alternative: "Include seated dumbbell press or landmine press."
  },
  'Shoulder Press - Dumbbell': {
    general: "Your dumbbell press needs progression.",
    technique: "Control the weights and maintain symmetry.",
    volume: "Alternate between seated and standing variations.",
    alternative: "Try Arnold press or single-arm variations."
  },

  // Tricep Exercises
  'Assisted Dips': {
    general: "Your assisted dip progress has stalled.",
    technique: "Keep chest up and elbows tucked.",
    volume: "Gradually reduce assistance weight each week.",
    alternative: "Try negative dips or diamond push-ups."
  },
  'Close-Grip Bench Press': {
    general: "Your close-grip bench needs attention.",
    technique: "Keep elbows tucked and wrists straight.",
    volume: "Try 4x8-12 with moderate weight for form.",
    alternative: "Include diamond push-ups or dips."
  },
  'Overhead Tricep Extensions': {
    general: "Your tricep extension progress has plateaued.",
    technique: "Keep elbows in and focus on full extension.",
    volume: "Implement drop sets or rest-pause sets.",
    alternative: "Try single-arm or rope variations."
  },
  'Skull Crushers': {
    general: "Your skull crusher progress needs a boost.",
    technique: "Keep elbows stable and control the negative.",
    volume: "Try varying grip widths and rep ranges.",
    alternative: "Include close-grip bench or JM press."
  },
  'Tricep Dips': {
    general: "Your dip progression has stalled.",
    technique: "Maintain upright posture and elbow tuck.",
    volume: "Add weight if doing more than 12 clean reps.",
    alternative: "Try bench dips or diamond push-ups."
  },
  'Tricep Pushdowns': {
    general: "Your pushdown progress needs attention.",
    technique: "Keep elbows at sides and focus on contraction.",
    volume: "Implement single-arm work or drop sets.",
    alternative: "Try reverse grip or rope variations."
  },

  // Default fallback
  'default': {
    general: "Progress has slowed down. Let's optimize your approach.",
    technique: "Review your form and ensure proper execution.",
    volume: "Try adjusting your set and rep scheme.",
    alternative: "Consider similar exercises that target the same muscle group."
  }
}

export function getPrioritizedPlateaus(
  exerciseProgress: Record<string, any>,
  exerciseTypes: Record<string, string>
) {
  const plateaus = Object.entries(exerciseProgress)
    .filter(([_, data]) => data.trend === 'neutral' || data.volumeProgress < 0)
    .map(([exerciseName, data]) => {
      const status = {
        severity: data.volumeProgress < -5 ? 'critical' as const : 'concern' as const,
        duration: data.history.length,
        message: data.volumeProgress < -5 ? 'Significant Decline' : 'Progress Stalled',
      }

      const recommendations = PLATEAU_RECOMMENDATIONS[exerciseName] || PLATEAU_RECOMMENDATIONS.default

      return {
        exerciseName,
        status: {
          ...status,
          recommendation: status.severity === 'critical' ? recommendations.technique : recommendations.volume,
          allRecommendations: recommendations
        }
      }
    })
    .sort((a, b) => {
      // First, prioritize critical issues
      if (a.status.severity === 'critical' && b.status.severity !== 'critical') return -1
      if (b.status.severity === 'critical' && a.status.severity !== 'critical') return 1

      // Then, sort by duration (number of workouts without progress)
      if (a.status.duration !== b.status.duration) {
        return b.status.duration - a.status.duration
      }
      
      // Finally, sort by compound movements
      const aIsCompound = exerciseTypes[a.exerciseName] === 'compound'
      const bIsCompound = exerciseTypes[b.exerciseName] === 'compound'
      if (aIsCompound && !bIsCompound) return -1
      if (!aIsCompound && bIsCompound) return 1
      
      return 0
    })

  return plateaus
}

// Additional analysis functions will go here... 