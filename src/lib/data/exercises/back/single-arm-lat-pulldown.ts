import { ExerciseTemplate } from '@/lib/types/exercise';

export const singleArmLatPulldown: ExerciseTemplate = {
  id: 'single-arm-lat-pulldown',
  name: 'Single Arm Lat Pulldown',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A unilateral variation of the lat pulldown that allows for greater focus on individual lat development and mind-muscle connection.',
  keyPoints: [
    'Maintain stable core position',
    'Focus on lat engagement',
    'Keep shoulder blade down',
    'Control entire movement'
  ],
  proTips: [
    'Use lighter weight to perfect form',
    'Try different handle attachments',
    'Focus on feeling stretch at top',
    'Consider leaning away slightly'
  ],
  instructions: [
    'Grasp handle with one hand',
    'Stabilize core and opposite side',
    'Pull handle down to shoulder',
    'Focus on lat contraction',
    'Control return to start'
  ],
  commonMistakes: [
    'Excessive twisting',
    'Using momentum',
    'Poor posture',
    'Rushing the movement'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Teres Major'],
    secondary: ['Rear Deltoid', 'Biceps', 'Core']
  }
}; 