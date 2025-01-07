import { ExerciseTemplate } from '@/lib/types/exercise';

export const cableKickbacks: ExerciseTemplate = {
  id: 'cable-kickbacks',
  name: 'Cable Kickbacks',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'An isolation exercise targeting the glutes with constant tension.',
  keyPoints: [
    'Keep standing leg stable',
    'Control the movement',
    'Maintain neutral spine',
    'Focus on glute squeeze'
  ],
  proTips: [
    'Start with light weight',
    'Use ankle strap properly',
    'Keep core engaged',
    'Hold peak contraction'
  ],
  instructions: [
    'Attach ankle strap',
    'Face cable machine',
    'Kick leg straight back',
    'Squeeze glute at top',
    'Control return'
  ],
  commonMistakes: [
    'Arching lower back',
    'Using momentum',
    'Rushing movement',
    'Not squeezing glutes'
  ],
  targetMuscles: {
    primary: ['Gluteus Maximus'],
    secondary: ['Hamstrings', 'Core']
  }
}; 