import { ExerciseTemplate } from '@/lib/types/exercise';

export const assistedDips: ExerciseTemplate = {
  id: 'assisted-dips',
  name: 'Assisted Dips',
  muscle_group: 'Tricep',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A progression exercise that helps build strength for full bodyweight dips while targeting the triceps.',
  keyPoints: [
    'Keep chest up',
    'Elbows close to body',
    'Control the descent',
    'Full range of motion'
  ],
  proTips: [
    'Gradually reduce assistance',
    'Focus on form over depth',
    'Keep shoulders down',
    'Practice lockout at top'
  ],
  instructions: [
    'Select appropriate assistance weight',
    'Grip bars shoulder width',
    'Lower body with control',
    'Keep elbows tucked',
    'Press back to start'
  ],
  commonMistakes: [
    'Leaning too far forward',
    'Flaring elbows',
    'Using too much assistance',
    'Shallow range of motion'
  ],
  targetMuscles: {
    primary: ['Triceps'],
    secondary: ['Chest', 'Anterior Deltoids']
  }
}; 