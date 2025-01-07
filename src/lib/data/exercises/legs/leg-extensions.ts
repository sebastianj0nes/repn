import { ExerciseTemplate } from '@/lib/types/exercise';

export const legExtensions: ExerciseTemplate = {
  id: 'leg-extensions',
  name: 'Leg Extensions',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise targeting the quadriceps through knee extension.',
  keyPoints: [
    'Keep back against pad',
    'Full extension at top',
    'Control the movement',
    'Focus on quad contraction'
  ],
  proTips: [
    'Point toes for better activation',
    'Hold peak contraction',
    'Try single leg variations',
    'Control negative portion'
  ],
  instructions: [
    'Adjust seat position',
    'Hook feet under pad',
    'Extend legs fully',
    'Squeeze quads at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Using momentum',
    'Lifting hips off seat',
    'Incomplete extension',
    'Rushing movement'
  ],
  targetMuscles: {
    primary: ['Quadriceps'],
    secondary: ['Knee Stabilizers']
  }
}; 