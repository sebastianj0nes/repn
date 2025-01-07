import { ExerciseTemplate } from '@/lib/types/exercise';

export const preacherCurls: ExerciseTemplate = {
  id: 'preacher-curls',
  name: 'Preacher Curls',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise that maximizes bicep engagement by eliminating body momentum and focusing on the negative portion.',
  keyPoints: [
    'Keep arms flat on pad',
    'Full range of motion',
    'Control negative portion',
    'Maintain proper posture'
  ],
  proTips: [
    'Use both barbell and dumbbells',
    'Focus on eccentric phase',
    'Adjust seat height properly',
    'Try single-arm variations'
  ],
  instructions: [
    'Adjust seat height appropriately',
    'Rest arms fully on pad',
    'Grip weight with palms up',
    'Curl weight up fully',
    'Lower with strict control'
  ],
  commonMistakes: [
    'Lifting hips off seat',
    'Not going full range',
    'Dropping weight at bottom',
    'Using too much weight'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii'],
    secondary: ['Brachialis', 'Forearm Flexors']
  }
}; 