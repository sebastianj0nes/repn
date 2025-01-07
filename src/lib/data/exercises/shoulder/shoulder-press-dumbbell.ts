import { ExerciseTemplate } from '@/lib/types/exercise';

export const shoulderPressDumbbell: ExerciseTemplate = {
  id: 'shoulder-press-dumbbell',
  name: 'Shoulder Press - Dumbbell',
  muscle_group: 'Shoulder',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A versatile shoulder press variation allowing for natural movement patterns and identifying strength imbalances.',
  keyPoints: [
    'Keep core engaged',
    'Press weights straight up',
    'Control the descent',
    'Maintain neutral spine'
  ],
  proTips: [
    'Start with neutral grip',
    'Rotate palms forward at top',
    'Use seated position for stability',
    'Keep shoulders down'
  ],
  instructions: [
    'Hold dumbbells at shoulders',
    'Elbows below wrists',
    'Press weights overhead',
    'Lock out at top',
    'Lower with control'
  ],
  commonMistakes: [
    'Pressing weights forward',
    'Arching back',
    'Uneven pressing',
    'Using momentum'
  ],
  targetMuscles: {
    primary: ['Anterior Deltoids', 'Middle Deltoids'],
    secondary: ['Triceps', 'Trapezius', 'Serratus Anterior']
  }
}; 