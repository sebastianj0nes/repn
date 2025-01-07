import { ExerciseTemplate } from '@/lib/types/exercise';

export const rearDeltFlyes: ExerciseTemplate = {
  id: 'rear-delt-flyes',
  name: 'Rear Delt Flyes',
  muscle_group: 'Shoulder',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise targeting the posterior deltoids, crucial for balanced shoulder development.',
  keyPoints: [
    'Bend forward at hips',
    'Keep chest parallel to ground',
    'Maintain slight elbow bend',
    'Focus on rear deltoid squeeze'
  ],
  proTips: [
    'Use lighter weights for proper form',
    'Try seated variations',
    'Perform higher reps',
    'Consider cable variations'
  ],
  instructions: [
    'Hinge forward at hips',
    'Let arms hang straight down',
    'Raise arms out to sides',
    'Squeeze shoulder blades',
    'Lower with control'
  ],
  commonMistakes: [
    'Using too much weight',
    'Swinging the weights',
    'Poor bent-over position',
    'Raising arms too high'
  ],
  targetMuscles: {
    primary: ['Posterior Deltoids'],
    secondary: ['Middle Deltoids', 'Trapezius', 'Rhomboids']
  }
}; 