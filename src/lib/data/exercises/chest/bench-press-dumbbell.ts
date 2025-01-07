import { ExerciseTemplate } from '@/lib/types/exercise';

export const benchPressDumbbell: ExerciseTemplate = {
  id: 'bench-press-dumbbell',
  name: 'Bench Press - Dumbbell',
  muscle_group: 'Chest',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A compound movement that allows for natural movement patterns and helps identify strength imbalances.',
  keyPoints: [
    'Keep wrists straight',
    'Control the weights',
    'Maintain arch',
    'Full range of motion'
  ],
  proTips: [
    'Start light to master control',
    'Use spotter for heavy sets',
    'Keep shoulders retracted',
    'Focus on even pressing'
  ],
  instructions: [
    'Lie on bench with dumbbells at shoulders',
    'Press weights straight up',
    'Lower with control to chest',
    'Keep elbows at 45 degrees',
    'Drive to starting position'
  ],
  commonMistakes: [
    'Uneven pressing',
    'Bouncing weights',
    'Flaring elbows',
    'Arching excessively'
  ],
  targetMuscles: {
    primary: ['Pectoralis Major'],
    secondary: ['Anterior Deltoids', 'Triceps']
  }
}; 