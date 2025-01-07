import { ExerciseTemplate } from '@/lib/types/exercise';

export const deadlifts: ExerciseTemplate = {
  id: 'deadlifts',
  name: 'Deadlifts',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'S',
  overview: 'A fundamental compound exercise that targets multiple muscle groups, primarily focusing on the posterior chain including the back, glutes, and hamstrings.',
  keyPoints: [
    'Maintain neutral spine throughout movement',
    'Keep bar close to shins and thighs',
    'Drive through heels',
    'Engage lats before lifting'
  ],
  proTips: [
    'Use mixed grip for heavier weights',
    'Practice hip hinge pattern without weight first',
    'Consider using lifting straps for working sets',
    'Reset between reps for better form'
  ],
  instructions: [
    'Stand with feet hip-width apart, bar over mid-foot',
    'Hinge at hips to grip bar just outside knees',
    'Brace core, pull slack out of bar',
    'Drive through heels while maintaining bar contact',
    'Lock out hips and knees at top'
  ],
  commonMistakes: [
    'Rounding the lower back',
    'Starting with bar too far from shins',
    'Jerking the weight off the floor',
    'Not engaging lats before lift'
  ],
  targetMuscles: {
    primary: ['Erector Spinae', 'Latissimus Dorsi', 'Gluteus Maximus'],
    secondary: ['Hamstrings', 'Trapezius', 'Forearms']
  }
}; 