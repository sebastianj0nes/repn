import { ExerciseTemplate } from '@/lib/types/exercise';

export const legPress: ExerciseTemplate = {
  id: 'leg-press',
  name: 'Leg Press',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A compound lower body exercise that allows for heavy loading with reduced spinal stress.',
  keyPoints: [
    'Keep lower back pressed',
    'Control the descent',
    'Full range of motion',
    'Maintain foot position'
  ],
  proTips: [
    'Vary foot placement',
    'Don\'t lock knees at top',
    'Control breathing',
    'Start light to perfect form'
  ],
  instructions: [
    'Position feet shoulder-width',
    'Lower weight controlled',
    'Keep back against pad',
    'Press through heels',
    'Return to start position'
  ],
  commonMistakes: [
    'Lifting lower back',
    'Locking knees',
    'Going too deep',
    'Using momentum'
  ],
  targetMuscles: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Hamstrings', 'Calves']
  }
}; 