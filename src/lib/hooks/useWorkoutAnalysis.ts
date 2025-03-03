import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/lib/database.types'
import { subMonths, format } from 'date-fns'
import { calculateFrequencyStats, calculateProgressStats, generateRecommendations, Recommendation } from '../utils/workoutAnalysis'

type Workout = {
  date: string;
  exercises: Array<{
    name: string;
  }>;
  muscle_group: string;
}

type WorkoutAnalysis = {
  frequencyStats: {
    totalWorkouts: number
    averagePerWeek: number
    mostFrequentMuscleGroups: string[]
    consistencyScore: number
    commonDays: number[]
    currentStreak: number
    bestStreak: number
    monthlyBreakdown: Array<{
      month: string;
      workouts: number;
      average: number;
    }>;
  }
  progressStats: {
    exerciseProgress: Record<string, {
      maxWeight: number
      volumeProgress: number
      lastUsed: string
      trend: 'increasing' | 'decreasing' | 'neutral'
      history: Array<{ date: string; weight: number; volume: number }>
    }>
    consistentExercises: string[]
    needsAttention: string[]
  }
  recommendations: {
    priority: Recommendation[]
    frequency: Recommendation[]
    variety: Recommendation[]
  }
  workouts: Array<{
    exercises: Array<{
      name: string;
    }>;
    muscle_group: string;
    date: string;
  }>
  exerciseLibrary: Record<string, { muscle_group: string; tier: 'A*' | 'A' | 'B' }>
  exerciseHistory: Record<string, {
    maxWeight: number;
    volumeProgress: number;
    lastUsed: string;
    trend: 'increasing' | 'decreasing' | 'neutral';
    history: Array<{ date: string; weight: number; volume: number }>;
  }>;
  exerciseTypes: Record<string, 'compound' | 'isolation'>;
}

type ExerciseLibrary = {
  [key: string]: {
    muscle_group: string;
    tier?: 'A*' | 'A' | 'B';
  };
}

export function useWorkoutAnalysis() {
  const supabase = createClientComponentClient<Database>()

  return useQuery<WorkoutAnalysis>({
    queryKey: ['workoutAnalysis'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const threeMonthsAgo = subMonths(new Date(), 3)
      
      const { data: workouts, error } = await supabase
        .from('workouts')
        .select(`
          id,
          date,
          muscle_group,
          exercises (
            name,
            exercise_sets (
              weight,
              reps,
              is_dropset,
              dropset_weight,
              dropset_reps
            )
          )
        `)
        .eq('user_id', user.id)
        .gte('date', threeMonthsAgo.toISOString())
        .order('date', { ascending: false })

      if (error) throw error

      const frequencyStats = calculateFrequencyStats(workouts)

      const { data: exercises } = await supabase
        .from('exercises_library')
        .select('name, muscle_group')

      const exerciseLibrary = exercises?.reduce((acc, ex) => ({...acc, [ex.name]: ex}), {}) || {}

      const progressStats = calculateProgressStats(workouts)
      const recommendations = generateRecommendations(
        frequencyStats, 
        progressStats, 
        workouts,
        exerciseLibrary
      )

      const commonDays = workouts
        .map(workout => new Date(workout.date).getDay())
        .reduce((acc, day) => {
          const count = workouts.filter(w => new Date(w.date).getDay() === day).length;
          return count >= 2 ? [...acc, day] : acc;
        }, [] as number[])

      const monthlyBreakdown = Array.from({ length: 3 }).map((_, i) => {
        const monthStart = subMonths(new Date(), i);
        const monthWorkouts = workouts.filter(w => 
          new Date(w.date).getMonth() === monthStart.getMonth()
        );
        return {
          month: format(monthStart, 'MMMM'),
          workouts: monthWorkouts.length,
          average: monthWorkouts.length / 4 // assuming 4 weeks per month
        };
      });

      return {
        frequencyStats: {
          ...frequencyStats,
          commonDays,
          currentStreak: calculateCurrentStreak(workouts),
          bestStreak: calculateBestStreak(workouts),
          monthlyBreakdown
        },
        progressStats,
        recommendations,
        workouts,
        exerciseLibrary,
        exerciseHistory: progressStats.exerciseProgress,
        exerciseTypes: Object.fromEntries(
          Object.keys(progressStats.exerciseProgress).map(name => [
            name,
            (exerciseLibrary as ExerciseLibrary)[name]?.tier === 'A*' ? 'compound' : 'isolation'
          ])
        )
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false // Prevent unnecessary refetches
  })
}

function calculateCurrentStreak(workouts: Workout[]): number {
  // Sort workouts by date descending
  const sortedDates = workouts.map(w => new Date(w.date)).sort((a, b) => b.getTime() - a.getTime());
  let streak = 0;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const dayDiff = Math.floor((sortedDates[i].getTime() - sortedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 1) streak++;
    else break;
  }
  
  return streak;
}

function calculateBestStreak(workouts: Workout[]): number {
  // Similar implementation for best streak
  return Math.max(calculateCurrentStreak(workouts), 7); // Placeholder
} 