import { ExerciseTemplate } from '@/lib/types/exercise';

export const shrugs: ExerciseTemplate = {
  id: 'shrugs',
  name: 'Shrugs',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'An isolation exercise targeting the upper trapezius muscles, essential for developing upper back thickness and strength.',
  keyPoints: [
    'Lift shoulders directly up toward ears',
    'Keep arms straight',
    'Control both up and down motion',
    'Maintain neutral spine'
  ],
  proTips: [
    'Use various implements (dumbbells, barbell, trap bar)',
    'Focus on peak contraction',
    'Try different rep ranges',
    'Consider behind-the-back variation'
  ],
  instructions: [
    'Stand holding weights at sides',
    'Keep arms straight and relaxed',
    'Elevate shoulders straight up',
    'Hold briefly at top',
    'Lower under control'
  ],
  commonMistakes: [
    'Rolling shoulders',
    'Using momentum',
    'Bending arms',
    'Moving too quickly'
  ],
  targetMuscles: {
    primary: ['Upper Trapezius'],
    secondary: ['Middle Trapezius', 'Levator Scapulae']
  }
}; 