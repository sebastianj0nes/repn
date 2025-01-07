import { ExerciseTemplate } from '@/lib/types/exercise';

export const barbellCurls: ExerciseTemplate = {
  id: 'barbell-curls',
  name: 'Barbell Curls',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A classic bicep exercise that allows for heavy loading and balanced muscle development.',
  keyPoints: [
    'Keep elbows fixed at sides',
    'Maintain straight back',
    'Full range of motion',
    'Control the negative portion'
  ],
  proTips: [
    'Vary grip width for different emphasis',
    'Keep wrists straight throughout',
    'Focus on squeezing at the top',
    'Use controlled tempo'
  ],
  instructions: [
    'Stand with feet shoulder-width apart',
    'Grip barbell shoulder-width',
    'Keep upper arms stationary',
    'Curl weight to shoulders',
    'Lower with control'
  ],
  commonMistakes: [
    'Swinging the body',
    'Moving elbows forward',
    'Using too much weight',
    'Incomplete range of motion'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii'],
    secondary: ['Brachialis', 'Forearms']
  }
}; 