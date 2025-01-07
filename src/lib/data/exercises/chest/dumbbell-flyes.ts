import { ExerciseTemplate } from '@/lib/types/exercise';

export const dumbbellFlyes: ExerciseTemplate = {
  id: 'dumbbell-flyes',
  name: 'Dumbbell Flyes',
  muscle_group: 'Chest',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'An isolation movement that stretches and targets the chest muscles through a wide range of motion.',
  keyPoints: [
    'Maintain slight elbow bend',
    'Wide arc movement',
    'Control through full range',
    'Focus on chest stretch'
  ],
  proTips: [
    'Start light to master form',
    'Keep consistent elbow bend',
    'Focus on feeling stretch',
    'Use controlled tempo'
  ],
  instructions: [
    'Lie on bench with weights up',
    'Slight bend in elbows',
    'Lower weights in wide arc',
    'Feel stretch at bottom',
    'Return to starting position'
  ],
  commonMistakes: [
    'Straightening arms',
    'Using too much weight',
    'Insufficient range of motion',
    'Bouncing at bottom'
  ],
  targetMuscles: {
    primary: ['Pectoralis Major'],
    secondary: ['Anterior Deltoids', 'Biceps']
  }
}; 