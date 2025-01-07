import { ExerciseTemplate } from '@/lib/types/exercise';

export const pullUps: ExerciseTemplate = {
  id: 'pull-ups',
  name: 'Pull-Ups',
  muscle_group: 'Back',
  exercise_type: 'bodyweight',
  tier: 'S',
  overview: 'Pull-ups are one of the most effective upper body exercises, primarily targeting the latissimus dorsi while engaging multiple other muscle groups.',
  keyPoints: [
    'Start with a full hang, arms extended',
    'Pull yourself up until chin clears the bar',
    'Keep core engaged throughout movement',
    'Lower with control to starting position'
  ],
  proTips: [
    'Focus on squeezing your lats',
    'Avoid swinging or kipping',
    'Use varied grip widths for different emphasis',
    'Practice negative reps to build strength'
  ],
  instructions: [
    'Grip the bar slightly wider than shoulder width',
    'Initiate the movement by depressing your shoulder blades',
    'Drive your elbows down and back',
    'Keep your core tight throughout the movement',
    'Control the descent to maintain tension'
  ],
  commonMistakes: [
    'Using momentum to swing up',
    'Not completing full range of motion',
    'Failing to engage lats properly',
    'Poor shoulder positioning'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids'],
    secondary: ['Biceps', 'Rear Deltoids', 'Core']
  }
}; 