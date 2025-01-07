import { ExerciseTemplate } from '@/lib/types/exercise';

export const hammerCurls: ExerciseTemplate = {
  id: 'hammer-curls',
  name: 'Hammer Curls',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A bicep variation that targets the brachialis and forearms while still engaging the biceps.',
  keyPoints: [
    'Keep palms facing each other',
    'Maintain stable elbows',
    'Control throughout movement',
    'Keep shoulders back'
  ],
  proTips: [
    'Alternate arms for better focus',
    'Try cross-body variation',
    'Use controlled tempo',
    'Focus on forearm engagement'
  ],
  instructions: [
    'Stand holding dumbbells at sides',
    'Palms facing each other',
    'Keep elbows at sides',
    'Curl weights up',
    'Lower with control'
  ],
  commonMistakes: [
    'Rotating wrists during movement',
    'Using momentum',
    'Moving elbows forward',
    'Rushing the negative'
  ],
  targetMuscles: {
    primary: ['Brachialis', 'Biceps Brachii'],
    secondary: ['Brachioradialis', 'Forearm Flexors']
  }
}; 