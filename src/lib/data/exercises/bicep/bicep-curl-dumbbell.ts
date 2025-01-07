import { ExerciseTemplate } from '@/lib/types/exercise';

export const bicepCurlDumbbell: ExerciseTemplate = {
  id: 'bicep-curl-dumbbell',
  name: 'Bicep Curl - Dumbbell',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A versatile bicep exercise allowing for unilateral training and natural movement patterns.',
  keyPoints: [
    'Keep elbows close to body',
    'Maintain stable upper arms',
    'Full range of motion',
    'Control throughout movement'
  ],
  proTips: [
    'Alternate arms for better focus',
    'Try incline bench variations',
    'Use controlled negatives',
    'Rotate wrists slightly at top'
  ],
  instructions: [
    'Stand with dumbbells at sides',
    'Palms facing forward',
    'Curl weights to shoulders',
    'Squeeze biceps at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Swinging weights',
    'Moving elbows forward',
    'Using momentum',
    'Partial repetitions'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii'],
    secondary: ['Brachialis', 'Forearm Flexors']
  }
}; 