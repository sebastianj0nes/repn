import { ExerciseTemplate } from '@/lib/types/exercise';

export const seatedCableRows: ExerciseTemplate = {
  id: 'seated-cable-rows',
  name: 'Seated Cable Rows',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A compound pulling movement that develops mid-back thickness and overall back strength with constant tension.',
  keyPoints: [
    'Maintain upright posture',
    'Keep chest proud',
    'Pull handle to lower chest',
    'Control the weight throughout'
  ],
  proTips: [
    'Experiment with different attachments',
    'Focus on squeezing shoulder blades',
    'Use higher reps for better mind-muscle connection',
    'Pause briefly at peak contraction'
  ],
  instructions: [
    'Sit with feet firmly on platform',
    'Grasp handle with extended arms',
    'Keep chest up, core tight',
    'Pull handle to lower chest',
    'Control return to start position'
  ],
  commonMistakes: [
    'Rocking back and forth',
    'Rounded back',
    'Using too much momentum',
    'Incomplete range of motion'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
    secondary: ['Rear Deltoids', 'Biceps', 'Forearms']
  }
}; 