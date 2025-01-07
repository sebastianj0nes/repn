import { ExerciseTemplate } from '@/lib/types/exercise';

export const chinUps: ExerciseTemplate = {
  id: 'chin-ups',
  name: 'Chin-Ups',
  muscle_group: 'Bicep',
  exercise_type: 'bodyweight',
  tier: 'B',
  overview: 'A compound pulling exercise emphasizing bicep engagement while also working the back muscles.',
  keyPoints: [
    'Use underhand grip',
    'Keep core engaged',
    'Pull chin over bar',
    'Control the descent'
  ],
  proTips: [
    'Start from dead hang',
    'Focus on bicep contraction',
    'Add weight when proficient',
    'Practice negative reps'
  ],
  instructions: [
    'Grip bar shoulder-width, palms facing you',
    'Hang with arms fully extended',
    'Pull body up to bar',
    'Clear chin over bar',
    'Lower with control'
  ],
  commonMistakes: [
    'Using momentum/swing',
    'Incomplete range of motion',
    'Poor shoulder position',
    'Rushing the movement'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii', 'Latissimus Dorsi'],
    secondary: ['Brachialis', 'Forearms', 'Core']
  }
}; 