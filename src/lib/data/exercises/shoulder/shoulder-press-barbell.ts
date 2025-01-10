import { ExerciseTemplate } from '@/lib/types/exercise';

export const shoulderPressBarbell: ExerciseTemplate = {
  id: 'shoulder-press-barbell',
  name: 'Shoulder Press - Barbell',
  muscle_group: 'Shoulder',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'A compound movement that builds overall shoulder strength and mass while engaging multiple supporting muscle groups.',
  keyPoints: [
    'Keep core tight',
    'Press directly overhead',
    'Full range of motion',
    'Maintain stable base'
  ],
  proTips: [
    'Use leg drive for heavy sets',
    'Keep elbows slightly forward',
    'Breathe at bottom of movement',
    'Consider seated variation'
  ],
  instructions: [
    'Grip bar just outside shoulders',
    'Unrack at upper chest',
    'Brace core and glutes',
    'Press bar overhead',
    'Lower with control'
  ],
  commonMistakes: [
    'Arching back excessively',
    'Pressing bar forward',
    'Not engaging core',
    'Incomplete lockout'
  ],
  targetMuscles: {
    primary: ['Anterior Deltoids', 'Middle Deltoids'],
    secondary: ['Triceps', 'Upper Chest', 'Trapezius']
  }
}; 