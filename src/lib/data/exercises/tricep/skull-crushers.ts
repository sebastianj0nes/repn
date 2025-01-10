import { ExerciseTemplate } from '@/lib/types/exercise';

export const skullCrushers: ExerciseTemplate = {
  id: 'skull-crushers',
  name: 'Skull Crushers',
  muscle_group: 'Tricep',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'An intense isolation exercise that effectively targets all three heads of the triceps.',
  keyPoints: [
    'Keep elbows pointed forward',
    'Control the descent',
    'Full extension at top',
    'Maintain upper arm position'
  ],
  proTips: [
    'Use various bars (ez-bar, straight bar)',
    'Keep elbows tucked',
    'Focus on tricep contraction',
    'Consider decline bench variation'
  ],
  instructions: [
    'Lie on bench, hold weight above face',
    'Keep upper arms vertical',
    'Lower weight behind head',
    'Extend arms fully',
    'Control the movement'
  ],
  commonMistakes: [
    'Letting elbows flare',
    'Moving upper arms',
    'Using too much weight',
    'Bouncing at bottom'
  ],
  targetMuscles: {
    primary: ['Triceps (All Heads)'],
    secondary: ['Anterior Deltoids']
  }
}; 