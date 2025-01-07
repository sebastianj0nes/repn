import { ExerciseTemplate } from '@/lib/types/exercise';

export const latPulldowns: ExerciseTemplate = {
  id: 'lat-pulldowns',
  name: 'Lat Pulldowns',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'Lat pulldowns are an excellent exercise for building back width and strength, particularly targeting the latissimus dorsi muscles. It\'s a great alternative to pull-ups and helps develop the muscles needed for them.',
  keyPoints: [
    'Grip bar slightly wider than shoulder width',
    'Lean back slightly (about 10 degrees)',
    'Pull bar to upper chest',
    'Control the weight throughout'
  ],
  proTips: [
    'Focus on pulling with elbows, not hands',
    'Keep chest up throughout movement',
    'Squeeze lats at bottom of movement',
    'Maintain slight arch in lower back'
  ],
  instructions: [
    'Adjust seat and knee pad for stability',
    'Grasp bar with overhand grip',
    'Start with arms fully extended',
    'Pull bar down to upper chest',
    'Control return to starting position'
  ],
  commonMistakes: [
    'Using too much momentum',
    'Pulling bar behind neck',
    'Leaning back too far',
    'Not controlling the eccentric'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids'],
    secondary: ['Biceps', 'Rear Deltoids', 'Teres Major']
  }
}; 