import { ExerciseTemplate } from '@/lib/types/exercise';

export const frontRaises: ExerciseTemplate = {
  id: 'front-raises',
  name: 'Front Raises',
  muscle_group: 'Shoulder',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'An isolation exercise targeting the anterior deltoids for complete shoulder development.',
  keyPoints: [
    'Raise arms to shoulder height',
    'Keep slight bend in elbows',
    'Control the movement',
    'Maintain neutral spine'
  ],
  proTips: [
    'Alternate arms for better control',
    'Use various implements',
    'Keep weight moderate',
    'Focus on form over weight'
  ],
  instructions: [
    'Stand with weights at thighs',
    'Slight bend in elbows',
    'Raise weights to shoulder height',
    'Pause briefly at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Swinging weights up',
    'Raising above shoulder height',
    'Using momentum',
    'Arching lower back'
  ],
  targetMuscles: {
    primary: ['Anterior Deltoids'],
    secondary: ['Upper Chest', 'Upper Trapezius']
  }
}; 