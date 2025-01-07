import { ExerciseTemplate } from '@/lib/types/exercise';

export const tricepPushdowns: ExerciseTemplate = {
  id: 'tricep-pushdowns',
  name: 'Tricep Pushdowns',
  muscle_group: 'Tricep',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A fundamental tricep isolation exercise that effectively targets all three heads of the triceps.',
  keyPoints: [
    'Keep elbows at sides',
    'Full extension at bottom',
    'Control the movement',
    'Maintain upright posture'
  ],
  proTips: [
    'Try different attachments',
    'Keep upper arms still',
    'Focus on contraction',
    'Use controlled negatives'
  ],
  instructions: [
    'Face cable machine, grip attachment',
    'Tuck elbows to sides',
    'Push weight down',
    'Full extension at bottom',
    'Control the return'
  ],
  commonMistakes: [
    'Moving upper arms',
    'Leaning too far forward',
    'Using momentum',
    'Incomplete extension'
  ],
  targetMuscles: {
    primary: ['Triceps (All Heads)'],
    secondary: ['Anterior Deltoids']
  }
}; 