import { ExerciseTemplate } from '@/lib/types/exercise';

export const tricepDips: ExerciseTemplate = {
  id: 'tricep-dips',
  name: 'Tricep Dips',
  muscle_group: 'Tricep',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'A compound bodyweight exercise that heavily targets the triceps while engaging multiple supporting muscle groups.',
  keyPoints: [
    'Keep body upright',
    'Elbows close to body',
    'Control the descent',
    'Full lockout at top'
  ],
  proTips: [
    'Start with assisted version if needed',
    'Add weight when proficient',
    'Keep shoulders down',
    'Focus on tricep engagement'
  ],
  instructions: [
    'Grip bars at shoulder width',
    'Support body with straight arms',
    'Lower body with control',
    'Keep chest up',
    'Press to full lockout'
  ],
  commonMistakes: [
    'Leaning too far forward',
    'Flaring elbows',
    'Rushing the movement',
    'Shallow range of motion'
  ],
  targetMuscles: {
    primary: ['Triceps'],
    secondary: ['Chest', 'Anterior Deltoids', 'Core']
  }
}; 