import { ExerciseTemplate } from '@/lib/types/exercise';

export const lunges: ExerciseTemplate = {
  id: 'lunges',
  name: 'Lunges',
  muscle_group: 'Legs',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A unilateral leg exercise that develops strength, balance, and coordination.',
  keyPoints: [
    'Keep torso upright',
    'Step distance appropriate',
    'Knee tracking aligned',
    'Control movement'
  ],
  proTips: [
    'Start bodyweight only',
    'Progress to dumbbells',
    'Try different variations',
    'Focus on balance'
  ],
  instructions: [
    'Stand tall',
    'Step forward or backward',
    'Lower until both knees 90°',
    'Push through front heel',
    'Return to start'
  ],
  commonMistakes: [
    'Knee passing toes',
    'Leaning forward',
    'Poor balance',
    'Uneven steps'
  ],
  targetMuscles: {
    primary: ['Quadriceps', 'Glutes'],
    secondary: ['Hamstrings', 'Calves', 'Core']
  }
}; 