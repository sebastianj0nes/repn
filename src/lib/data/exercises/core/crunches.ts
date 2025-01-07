import { ExerciseTemplate } from '@/lib/types/exercise';

export const crunches: ExerciseTemplate = {
  id: 'crunches',
  name: 'Crunches',
  muscle_group: 'Core',
  exercise_type: 'bodyweight',
  tier: 'B',
  overview: 'A fundamental core exercise targeting the upper abdominal muscles.',
  keyPoints: [
    'Curl upper body only',
    'Keep lower back pressed down',
    'Focus on contraction',
    'Control movement'
  ],
  proTips: [
    'Quality over quantity',
    'Avoid pulling neck',
    'Exhale on contraction',
    'Add resistance when ready'
  ],
  instructions: [
    'Lie on back, knees bent',
    'Hands behind head',
    'Curl shoulders off ground',
    'Squeeze abs at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Using momentum',
    'Pulling on neck',
    'Full sit-up motion',
    'Rushing reps'
  ],
  targetMuscles: {
    primary: ['Rectus Abdominis'],
    secondary: ['Obliques']
  }
}; 