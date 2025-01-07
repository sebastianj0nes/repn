import { ExerciseTemplate } from '@/lib/types/exercise';

export const singleLegSquat: ExerciseTemplate = {
  id: 'single-leg-squat',
  name: 'Single Leg Squat',
  muscle_group: 'Legs',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'A challenging unilateral exercise that develops strength, balance, and stability.',
  keyPoints: [
    'Maintain balance',
    'Keep knee aligned',
    'Control the movement',
    'Core stays engaged'
  ],
  proTips: [
    'Start with assisted version',
    'Progress depth gradually',
    'Focus on stability',
    'Keep chest up'
  ],
  instructions: [
    'Stand on one leg',
    'Other leg slightly raised',
    'Lower body controlled',
    'Keep knee stable',
    'Push through heel to rise'
  ],
  commonMistakes: [
    'Knee caving in',
    'Loss of balance',
    'Leaning too far forward',
    'Rushing movement'
  ],
  targetMuscles: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Hamstrings', 'Core', 'Stabilizers']
  }
}; 