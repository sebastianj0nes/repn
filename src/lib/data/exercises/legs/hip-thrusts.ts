import { ExerciseTemplate } from '@/lib/types/exercise';

export const hipThrusts: ExerciseTemplate = {
  id: 'hip-thrusts',
  name: 'Hip Thrusts',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A powerful glute exercise that effectively targets the posterior chain.',
  keyPoints: [
    'Drive through heels',
    'Full hip extension',
    'Keep chin tucked',
    'Squeeze glutes at top'
  ],
  proTips: [
    'Use padding on bar',
    'Position bench correctly',
    'Focus on glute activation',
    'Control the descent'
  ],
  instructions: [
    'Sit against bench',
    'Position bar over hips',
    'Plant feet firmly',
    'Drive hips up',
    'Squeeze at top'
  ],
  commonMistakes: [
    'Overarching back',
    'Not reaching full extension',
    'Using momentum',
    'Wrong bench height'
  ],
  targetMuscles: {
    primary: ['Gluteus Maximus'],
    secondary: ['Hamstrings', 'Lower Back']
  }
}; 