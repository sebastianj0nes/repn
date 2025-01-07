import { ExerciseTemplate } from '@/lib/types/exercise';

export const declineBenchPress: ExerciseTemplate = {
  id: 'decline-bench-press',
  name: 'Decline Bench Press',
  muscle_group: 'Chest',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A variation of the bench press that emphasizes the lower chest muscles.',
  keyPoints: [
    'Secure legs properly',
    'Control bar path',
    'Keep shoulders back',
    'Maintain stability'
  ],
  proTips: [
    'Start with regular bench first',
    'Use spotter when heavy',
    'Focus on lower chest squeeze',
    'Keep wrists straight'
  ],
  instructions: [
    'Secure feet in bench',
    'Grip bar shoulder width plus',
    'Lower bar to lower chest',
    'Press to lockout',
    'Control the descent'
  ],
  commonMistakes: [
    'Bouncing bar off chest',
    'Improper foot position',
    'Flaring elbows',
    'Losing tightness'
  ],
  targetMuscles: {
    primary: ['Lower Pectoralis Major'],
    secondary: ['Anterior Deltoids', 'Triceps']
  }
}; 