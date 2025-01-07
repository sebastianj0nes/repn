import { ExerciseTemplate } from '@/lib/types/exercise';

export const deadlifts: ExerciseTemplate = {
  id: 'deadlifts',
  name: 'Deadlifts',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'S',
  overview: 'The deadlift is one of the most effective compound exercises, targeting multiple muscle groups while building overall strength and power. It\'s considered a fundamental movement pattern essential for both strength and functional fitness.',
  keyPoints: [
    'Bar over mid-foot',
    'Shoulders slightly ahead of bar',
    'Straight arms, engaged lats',
    'Push floor away to initiate lift'
  ],
  proTips: [
    'Take slack out of bar before lifting',
    'Keep bar close to body throughout',
    'Breathe and brace properly',
    'Drive hips and knees in unison'
  ],
  instructions: [
    'Position feet hip-width apart under bar',
    'Bend and grip bar outside knees',
    'Drop hips and raise chest',
    'Take deep breath and brace core',
    'Drive through heels while keeping bar close'
  ],
  commonMistakes: [
    'Rounding the back',
    'Starting with hips too high',
    'Letting bar drift forward',
    'Not engaging lats'
  ],
  targetMuscles: {
    primary: ['Erector Spinae', 'Latissimus Dorsi', 'Trapezius'],
    secondary: ['Glutes', 'Hamstrings', 'Core', 'Forearms']
  }
}; 