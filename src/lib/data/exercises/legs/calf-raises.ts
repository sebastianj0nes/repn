import { ExerciseTemplate } from '@/lib/types/exercise';

export const calfRaises: ExerciseTemplate = {
  id: 'calf-raises',
  name: 'Calf Raises',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise targeting the calf muscles for lower leg development.',
  keyPoints: [
    'Full range of motion',
    'Control movement',
    'Pause at top',
    'Feel stretch at bottom'
  ],
  proTips: [
    'Try different foot positions',
    'Use various equipment',
    'Do both seated and standing',
    'Focus on peak contraction'
  ],
  instructions: [
    'Stand on edge of platform',
    'Heels hanging off',
    'Rise up on toes',
    'Hold at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Partial range of motion',
    'Rushing reps',
    'Not pausing at top',
    'Using momentum'
  ],
  targetMuscles: {
    primary: ['Gastrocnemius', 'Soleus'],
    secondary: ['Tibialis Anterior']
  }
}; 