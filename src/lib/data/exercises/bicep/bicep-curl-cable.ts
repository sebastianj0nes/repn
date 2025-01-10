import { ExerciseTemplate } from '@/lib/types/exercise';

export const bicepCurlCable: ExerciseTemplate = {
  id: 'bicep-curl-cable',
  name: 'Bicep Curl - Cable',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'A superior bicep exercise providing constant tension throughout the movement for maximum muscle activation.',
  keyPoints: [
    'Maintain constant tension',
    'Keep elbows stationary',
    'Focus on controlled movement',
    'Full range of motion'
  ],
  proTips: [
    'Try different attachments',
    'Experiment with single-arm variations',
    'Use pause reps for intensity',
    'Position body for optimal cable angle'
  ],
  instructions: [
    'Stand centered to cable',
    'Grip attachment with palms up',
    'Keep upper arms fixed',
    'Curl handles to shoulders',
    'Control the descent'
  ],
  commonMistakes: [
    'Leaning back excessively',
    'Moving elbows during curl',
    'Rushing the movement',
    'Standing too close/far from cable'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii'],
    secondary: ['Brachialis', 'Forearm Flexors']
  }
}; 