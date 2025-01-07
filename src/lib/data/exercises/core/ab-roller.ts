import { ExerciseTemplate } from '@/lib/types/exercise';

export const abRoller: ExerciseTemplate = {
  id: 'ab-roller',
  name: 'Ab Roller',
  muscle_group: 'Core',
  exercise_type: 'bodyweight',
  tier: 'S',
  overview: 'A challenging core exercise that develops strength and stability throughout the entire midsection.',
  keyPoints: [
    'Keep core engaged throughout',
    'Maintain neutral spine',
    'Control both out and in phases',
    'Breathe steadily'
  ],
  proTips: [
    'Start on knees for progression',
    'Use mat for knee comfort',
    'Progress to standing slowly',
    'Focus on controlled return'
  ],
  instructions: [
    'Kneel with roller in front',
    'Engage core tightly',
    'Roll forward with straight arms',
    'Extend as far as control allows',
    'Pull back to start'
  ],
  commonMistakes: [
    'Sagging lower back',
    'Rolling out too far',
    'Using momentum',
    'Holding breath'
  ],
  targetMuscles: {
    primary: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondary: ['Obliques', 'Shoulders', 'Lats']
  }
}; 