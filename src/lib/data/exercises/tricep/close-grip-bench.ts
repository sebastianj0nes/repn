import { ExerciseTemplate } from '@/lib/types/exercise';

export const closeGripBench: ExerciseTemplate = {
  id: 'close-grip-bench',
  name: 'Close-Grip Bench',
  muscle_group: 'Tricep',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A compound movement that emphasizes tricep development while also engaging chest and shoulders.',
  keyPoints: [
    'Grip narrower than shoulder width',
    'Keep elbows tucked',
    'Control the descent',
    'Full lockout at top'
  ],
  proTips: [
    'Don\'t grip too narrow',
    'Keep wrists straight',
    'Use spotter for heavy sets',
    'Focus on tricep engagement'
  ],
  instructions: [
    'Lie on bench with narrow grip',
    'Unrack weight with straight arms',
    'Lower bar to lower chest',
    'Keep elbows close to body',
    'Press to full lockout'
  ],
  commonMistakes: [
    'Grip too narrow',
    'Flaring elbows',
    'Bouncing off chest',
    'Incomplete lockout'
  ],
  targetMuscles: {
    primary: ['Triceps'],
    secondary: ['Chest', 'Anterior Deltoids']
  }
}; 