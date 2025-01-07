import { ExerciseTemplate } from '@/lib/types/exercise';

export const squats: ExerciseTemplate = {
  id: 'squats',
  name: 'Squats',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'S',
  overview: 'The king of leg exercises, developing overall lower body strength and muscle mass.',
  keyPoints: [
    'Keep chest up',
    'Knees track toes',
    'Maintain neutral spine',
    'Break at hips and knees'
  ],
  proTips: [
    'Start with bodyweight',
    'Progress weight gradually',
    'Focus on depth control',
    'Breathe properly'
  ],
  instructions: [
    'Bar across upper back',
    'Feet shoulder-width',
    'Break at hips and knees',
    'Lower to parallel or below',
    'Drive through heels'
  ],
  commonMistakes: [
    'Knees caving in',
    'Rounding back',
    'Rising on toes',
    'Shallow depth'
  ],
  targetMuscles: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Hamstrings', 'Core', 'Lower Back']
  }
}; 