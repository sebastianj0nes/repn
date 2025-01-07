import { ExerciseTemplate } from '@/lib/types/exercise';

export const seatedCableRows: ExerciseTemplate = {
  id: 'seated-cable-rows',
  name: 'Seated Cable Rows',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'Seated cable rows are a compound exercise that targets the middle back while providing constant tension throughout the movement. The cable machine allows for smooth, controlled motion and helps develop both strength and muscle definition.',
  keyPoints: [
    'Maintain upright posture',
    'Pull handle to lower chest',
    'Keep chest up and shoulders back',
    'Control both phases of movement'
  ],
  proTips: [
    'Focus on squeezing shoulder blades',
    'Avoid excessive lean forward/back',
    'Keep elbows close to body',
    'Pause briefly at peak contraction'
  ],
  instructions: [
    'Sit with feet secured on platform',
    'Grasp handle with extended arms',
    'Keep chest up and back straight',
    'Pull handle to lower chest',
    'Control return to start position'
  ],
  commonMistakes: [
    'Using momentum to pull',
    'Rounding the back',
    'Moving torso too much',
    'Releasing tension at extension'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
    secondary: ['Rear Deltoids', 'Biceps', 'Core']
  }
}; 