import { ExerciseTemplate } from '@/lib/types/exercise';

export const legRaises: ExerciseTemplate = {
  id: 'leg-raises',
  name: 'Leg Raises',
  muscle_group: 'Core',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'An effective lower abdominal exercise that also engages the hip flexors.',
  keyPoints: [
    'Keep legs straight',
    'Control the movement',
    'Maintain lower back contact',
    'Engage core throughout'
  ],
  proTips: [
    'Start with bent knees if needed',
    'Use bench for better form',
    'Focus on lower abs',
    'Control descent'
  ],
  instructions: [
    'Lie flat on back',
    'Keep legs straight',
    'Raise legs to 90 degrees',
    'Lower with control',
    'Maintain core tension'
  ],
  commonMistakes: [
    'Swinging legs',
    'Lifting lower back',
    'Using momentum',
    'Dropping legs too fast'
  ],
  targetMuscles: {
    primary: ['Lower Rectus Abdominis'],
    secondary: ['Hip Flexors', 'Obliques']
  }
}; 