import { ExerciseTemplate } from '@/lib/types/exercise';

export const assistedPullUps: ExerciseTemplate = {
  id: 'assisted-pull-ups',
  name: 'Assisted Pull-ups',
  muscle_group: 'Back',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'Assisted pull-ups are an excellent progression exercise for developing back strength and working towards unassisted pull-ups. The assistance mechanism reduces your effective body weight, making the movement more manageable while maintaining proper form.',
  keyPoints: [
    'Grip the bar slightly wider than shoulder width',
    'Keep core engaged throughout movement',
    'Pull shoulder blades down and back',
    'Focus on pulling with your back, not arms'
  ],
  proTips: [
    'Gradually decrease assistance weight over time',
    'Practice slow negatives for strength building',
    'Focus on squeezing your lats at the top',
    'Maintain controlled descent'
  ],
  instructions: [
    'Select appropriate assistance weight',
    'Grip bar with palms facing away',
    'Start from dead hang position',
    'Pull up until chin clears the bar',
    'Lower with control to starting position'
  ],
  commonMistakes: [
    'Using too much assistance',
    'Swinging or using momentum',
    'Not completing full range of motion',
    'Relying too much on arms'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids'],
    secondary: ['Biceps', 'Rear Deltoids', 'Core']
  }
}; 