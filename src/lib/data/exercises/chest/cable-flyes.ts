import { ExerciseTemplate } from '@/lib/types/exercise';

export const cableFlyes: ExerciseTemplate = {
  id: 'cable-flyes',
  name: 'Cable Flyes',
  muscle_group: 'Chest',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise that provides constant tension throughout the movement for optimal chest development.',
  keyPoints: [
    'Maintain slight elbow bend',
    'Focus on chest squeeze',
    'Control the movement',
    'Keep chest up'
  ],
  proTips: [
    'Adjust cable height for variation',
    'Experiment with angles',
    'Focus on stretch and squeeze',
    'Use controlled tempo'
  ],
  instructions: [
    'Stand between cable stations',
    'Slight forward lean',
    'Arms wide with bend',
    'Bring hands together',
    'Control return stretch'
  ],
  commonMistakes: [
    'Locking elbows',
    'Using too much weight',
    'Poor posture',
    'Rushing movement'
  ],
  targetMuscles: {
    primary: ['Pectoralis Major'],
    secondary: ['Anterior Deltoids', 'Biceps']
  }
}; 