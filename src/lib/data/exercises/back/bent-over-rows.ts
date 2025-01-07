import { ExerciseTemplate } from '@/lib/types/exercise';

export const bentOverRows: ExerciseTemplate = {
  id: 'bent-over-rows',
  name: 'Bent-Over Rows',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'A',
  overview: 'A fundamental back exercise that builds thickness and strength in the upper and mid-back regions.',
  keyPoints: [
    'Maintain flat back throughout',
    'Keep core braced',
    'Pull weight to lower chest/upper abdomen',
    'Control the negative portion'
  ],
  proTips: [
    'Experiment with grip width for different emphasis',
    'Use straps for heavier sets if grip fails',
    'Think about pulling elbows to ceiling',
    'Reset position between reps if needed'
  ],
  instructions: [
    'Hinge at hips to ~45 degree angle',
    'Grip barbell slightly wider than shoulders',
    'Let arms hang straight down',
    'Pull bar to lower chest',
    'Lower with control'
  ],
  commonMistakes: [
    'Rounding the back',
    'Using too much body English',
    'Not pulling bar high enough',
    'Letting chest drop'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
    secondary: ['Rear Deltoids', 'Biceps', 'Core']
  }
}; 