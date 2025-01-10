import { ExerciseTemplate } from '@/lib/types/exercise';

export const rdl: ExerciseTemplate = {
  id: 'rdl',
  name: 'RDL',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'A hip-hinge movement that targets the posterior chain with emphasis on hamstrings and glutes.',
  keyPoints: [
    'Maintain neutral spine',
    'Hip hinge movement',
    'Keep bar close',
    'Feel hamstring stretch'
  ],
  proTips: [
    'Start light to perfect form',
    'Push hips back',
    'Keep shoulders retracted',
    'Control the descent'
  ],
  instructions: [
    'Hold bar at thighs',
    'Push hips back',
    'Lower bar along legs',
    'Feel stretch in hamstrings',
    'Drive hips forward to return'
  ],
  commonMistakes: [
    'Rounding back',
    'Bending knees too much',
    'Bar path too far forward',
    'Not hinging at hips'
  ],
  targetMuscles: {
    primary: ['Hamstrings', 'Glutes'],
    secondary: ['Lower Back', 'Core']
  }
}; 