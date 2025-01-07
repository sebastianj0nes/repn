import { ExerciseTemplate } from '@/lib/types/exercise';

export const facePulls: ExerciseTemplate = {
  id: 'face-pulls',
  name: 'Face Pulls',
  muscle_group: 'Shoulder',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A crucial exercise for rear deltoid development and overall shoulder health.',
  keyPoints: [
    'Pull towards face level',
    'External rotate at end',
    'Keep chest up',
    'Control throughout movement'
  ],
  proTips: [
    'Use rope attachment',
    'Focus on squeezing rear delts',
    'Keep elbows high',
    'Perform higher reps'
  ],
  instructions: [
    'Set cable at head height',
    'Grip rope with thumbs up',
    'Step back to create tension',
    'Pull towards face, elbows high',
    'Return with control'
  ],
  commonMistakes: [
    'Using too much weight',
    'Pulling too low',
    'Not externally rotating',
    'Poor posture'
  ],
  targetMuscles: {
    primary: ['Rear Deltoids', 'External Rotators'],
    secondary: ['Middle Trapezius', 'Rhomboids']
  }
}; 