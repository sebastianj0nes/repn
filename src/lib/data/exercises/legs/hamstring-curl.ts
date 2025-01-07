import { ExerciseTemplate } from '@/lib/types/exercise';

export const hamstringCurl: ExerciseTemplate = {
  id: 'hamstring-curl',
  name: 'Hamstring Curl',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise targeting the hamstrings through knee flexion.',
  keyPoints: [
    'Keep hips pressed down',
    'Control the movement',
    'Full range of motion',
    'Focus on contraction'
  ],
  proTips: [
    'Try both lying and seated',
    'Point toes for better activation',
    'Use single leg variation',
    'Control negative portion'
  ],
  instructions: [
    'Lie face down on machine',
    'Align knees with pivot',
    'Curl weight to glutes',
    'Squeeze at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Lifting hips',
    'Using momentum',
    'Incomplete range of motion',
    'Rushing movement'
  ],
  targetMuscles: {
    primary: ['Hamstrings'],
    secondary: ['Calves', 'Glutes']
  }
}; 