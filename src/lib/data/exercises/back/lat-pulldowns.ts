import { ExerciseTemplate } from '@/lib/types/exercise';

export const latPulldowns: ExerciseTemplate = {
  id: 'lat-pulldowns',
  name: 'Lat Pulldowns',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A machine-based exercise that mimics the pull-up movement pattern, excellent for building back width and strength.',
  keyPoints: [
    'Keep chest up throughout movement',
    'Drive elbows down and back',
    'Maintain slight lean backward',
    'Full range of motion from stretch to contraction'
  ],
  proTips: [
    'Vary grip width for different emphasis',
    'Focus on feeling lats contract',
    'Use thumbless grip for better mind-muscle connection',
    'Control the eccentric portion'
  ],
  instructions: [
    'Adjust seat height for full arm extension',
    'Grasp bar wider than shoulder width',
    'Lean back slightly (10-15 degrees)',
    'Pull bar to upper chest',
    'Control return to starting position'
  ],
  commonMistakes: [
    'Pulling with arms instead of back',
    'Leaning back too far',
    'Using momentum to swing',
    'Incomplete range of motion'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Teres Major'],
    secondary: ['Biceps', 'Rear Deltoids', 'Rhomboids']
  }
}; 