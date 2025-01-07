import { ExerciseTemplate } from '@/lib/types/exercise';

export const concentrationCurls: ExerciseTemplate = {
  id: 'concentration-curls',
  name: 'Concentration Curls',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'S',
  overview: 'An isolation exercise that maximizes bicep peak contraction and eliminates momentum.',
  keyPoints: [
    'Keep elbow pressed against inner thigh',
    'Minimize body movement',
    'Focus on peak contraction',
    'Slow, controlled movement'
  ],
  proTips: [
    'Use moderate weight for proper form',
    'Pause at peak contraction',
    'Keep wrist straight',
    'Focus on mind-muscle connection'
  ],
  instructions: [
    'Sit on bench, lean forward',
    'Rest elbow on inner thigh',
    'Let arm hang straight down',
    'Curl weight to shoulder',
    'Lower with control'
  ],
  commonMistakes: [
    'Swinging the weight',
    'Moving elbow from thigh',
    'Using momentum',
    'Rushing the movement'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii'],
    secondary: ['Brachialis', 'Forearm Flexors']
  }
}; 