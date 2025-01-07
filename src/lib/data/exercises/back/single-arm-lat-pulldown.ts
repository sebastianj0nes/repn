import { ExerciseTemplate } from '@/lib/types/exercise';

export const singleArmLatPulldown: ExerciseTemplate = {
  id: 'single-arm-lat-pulldown',
  name: 'Single Arm Lat Pulldown',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'The single-arm lat pulldown allows for greater focus on individual lat development while identifying and correcting muscle imbalances. It also provides a greater range of motion and mind-muscle connection than traditional pulldowns.',
  keyPoints: [
    'Stabilize core throughout movement',
    'Keep shoulder blade down',
    'Pull elbow down and back',
    'Maintain upright posture'
  ],
  proTips: [
    'Focus on lat contraction',
    'Avoid leaning or twisting',
    'Control the eccentric phase',
    'Use lighter weight for better form'
  ],
  instructions: [
    'Adjust seat for stability',
    'Grasp handle with one hand',
    'Start with arm fully extended',
    'Pull handle down to shoulder level',
    'Control return to start position'
  ],
  commonMistakes: [
    'Using too much weight',
    'Rotating torso',
    'Relying on arm strength',
    'Rushing the movement'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Teres Major'],
    secondary: ['Biceps', 'Rear Deltoid', 'Core']
  }
}; 