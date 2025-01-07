import { ExerciseTemplate } from '@/lib/types/exercise';

export const russianTwists: ExerciseTemplate = {
  id: 'russian-twists',
  name: 'Russian Twists',
  muscle_group: 'Core',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'A rotational exercise that targets the obliques and deep core muscles.',
  keyPoints: [
    'Keep feet elevated',
    'Maintain chest up',
    'Control rotation',
    'Keep core engaged'
  ],
  proTips: [
    'Start without weight',
    'Progress to added resistance',
    'Focus on rotation quality',
    'Keep back straight'
  ],
  instructions: [
    'Sit with knees bent',
    'Lean back slightly',
    'Lift feet off ground',
    'Rotate side to side',
    'Touch ground each side'
  ],
  commonMistakes: [
    'Dropping feet',
    'Rounding back',
    'Using momentum',
    'Rotating too fast'
  ],
  targetMuscles: {
    primary: ['Obliques'],
    secondary: ['Rectus Abdominis', 'Hip Flexors']
  }
}; 