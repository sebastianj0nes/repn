import { ExerciseTemplate } from '@/lib/types/exercise';

export const overheadTricepExtensions: ExerciseTemplate = {
  id: 'overhead-tricep-extensions',
  name: 'Overhead Tricep Extensions',
  muscle_group: 'Tricep',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise that effectively targets all three heads of the triceps with emphasis on the long head.',
  keyPoints: [
    'Keep elbows close to head',
    'Full range of motion',
    'Control throughout movement',
    'Maintain stable core'
  ],
  proTips: [
    'Try different implements (dumbbell, rope, ez-bar)',
    'Keep upper arms vertical',
    'Focus on stretch at bottom',
    'Squeeze at lockout'
  ],
  instructions: [
    'Hold weight behind head',
    'Keep upper arms stationary',
    'Extend arms overhead',
    'Feel triceps stretch',
    'Lower with control'
  ],
  commonMistakes: [
    'Moving elbows away from head',
    'Using momentum',
    'Incomplete range of motion',
    'Arching lower back'
  ],
  targetMuscles: {
    primary: ['Triceps (Long Head)'],
    secondary: ['Triceps (Lateral Head)', 'Triceps (Medial Head)']
  }
}; 