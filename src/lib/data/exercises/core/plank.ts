import { ExerciseTemplate } from '@/lib/types/exercise';

export const plank: ExerciseTemplate = {
  id: 'plank',
  name: 'Plank',
  muscle_group: 'Core',
  exercise_type: 'bodyweight',
  tier: 'A*',
  overview: 'A fundamental isometric core exercise that builds overall core stability and endurance.',
  keyPoints: [
    'Maintain straight body line',
    'Engage core fully',
    'Keep shoulders stable',
    'Breathe steadily'
  ],
  proTips: [
    'Start with shorter holds',
    'Progress to longer durations',
    'Add variations when stable',
    'Check form in mirror'
  ],
  instructions: [
    'Forearms on ground',
    'Body straight as board',
    'Engage core and glutes',
    'Hold position',
    'Maintain proper breathing'
  ],
  commonMistakes: [
    'Sagging hips',
    'Raised buttocks',
    'Looking forward',
    'Holding breath'
  ],
  targetMuscles: {
    primary: ['Core', 'Transverse Abdominis'],
    secondary: ['Shoulders', 'Lower Back', 'Glutes']
  }
}; 