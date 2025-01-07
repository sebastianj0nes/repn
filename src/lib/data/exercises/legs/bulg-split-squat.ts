import { ExerciseTemplate } from '@/lib/types/exercise';

export const bulgSplitSquat: ExerciseTemplate = {
  id: 'bulg-split-squat',
  name: 'Bulgarian Split Squat',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A unilateral leg exercise that develops strength, balance, and mobility.',
  keyPoints: [
    'Keep front knee aligned',
    'Maintain upright torso',
    'Control the descent',
    'Balance is crucial'
  ],
  proTips: [
    'Start bodyweight only',
    'Find optimal foot position',
    'Progress to dumbbells',
    'Keep core engaged'
  ],
  instructions: [
    'Back foot elevated on bench',
    'Front foot forward enough',
    'Lower until back knee near ground',
    'Drive through front heel',
    'Maintain balance throughout'
  ],
  commonMistakes: [
    'Front knee caving in',
    'Leaning too far forward',
    'Poor foot placement',
    'Rushing the movement'
  ],
  targetMuscles: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Hamstrings', 'Core', 'Hip Flexors']
  }
}; 