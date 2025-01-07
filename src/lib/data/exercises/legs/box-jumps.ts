import { ExerciseTemplate } from '@/lib/types/exercise';

export const boxJumps: ExerciseTemplate = {
  id: 'box-jumps',
  name: 'Box Jumps',
  muscle_group: 'Legs',
  exercise_type: 'bodyweight',
  tier: 'B',
  overview: 'A plyometric exercise that develops explosive power in the lower body.',
  keyPoints: [
    'Land softly',
    'Use arms for momentum',
    'Step down, don\'t jump',
    'Choose appropriate height'
  ],
  proTips: [
    'Start with lower box',
    'Focus on landing mechanics',
    'Progress height gradually',
    'Always step down'
  ],
  instructions: [
    'Stand facing box',
    'Hip-hinge slightly',
    'Swing arms and jump',
    'Land softly on box',
    'Step down carefully'
  ],
  commonMistakes: [
    'Jumping down',
    'Using too high box',
    'Landing heavy',
    'Not using arms'
  ],
  targetMuscles: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Calves', 'Hamstrings', 'Core']
  }
}; 