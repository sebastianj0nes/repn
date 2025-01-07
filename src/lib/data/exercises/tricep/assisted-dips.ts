import { ExerciseTemplate } from '@/lib/types/exercise';

export const assistedDips: ExerciseTemplate = {
  id: 'assisted-dips',
  name: 'Assisted Dips',
  muscle_group: 'Tricep',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'Assisted dips are a great progression exercise for building chest, tricep, and shoulder strength while working towards unassisted dips.',
  keyPoints: [
    'Set appropriate assistance weight',
    'Keep chest slightly forward for chest focus',
    'Lower until upper arms are parallel to ground',
    'Maintain controlled movement throughout'
  ],
  proTips: [
    'Gradually decrease assistance weight',
    'Focus on full range of motion',
    'Keep elbows tucked to protect shoulders',
    'Practice scapular depression at top'
  ],
  instructions: [
    'Step onto assistance platform and grip handles',
    'Keep chest up and shoulders back',
    'Lower body until upper arms are parallel',
    'Push back up to starting position',
    'Maintain tension throughout movement'
  ],
  commonMistakes: [
    'Using too much assistance',
    'Insufficient range of motion',
    'Flaring elbows excessively',
    'Rushing the movement'
  ],
  targetMuscles: {
    primary: ['Pectoralis Major', 'Triceps'],
    secondary: ['Anterior Deltoids', 'Serratus Anterior']
  }
}; 