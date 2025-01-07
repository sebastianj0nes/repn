import { ExerciseTemplate } from '@/lib/types/exercise';

export const abRoller: ExerciseTemplate = {
  id: 'ab-roller',
  name: 'Ab Roller',
  muscle_group: 'Core',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'The ab roller is an advanced core exercise that targets the entire abdominal wall while engaging the lats, shoulders, and lower back as stabilizers.',
  keyPoints: [
    'Start on knees with roller directly under shoulders',
    'Keep arms straight throughout movement',
    'Engage core before initiating roll-out',
    'Control the movement in both directions'
  ],
  proTips: [
    'Begin with partial range of motion if new to the exercise',
    'Focus on keeping lower back from arching',
    'Exhale during the hardest part of the movement',
    'Progress to standing position for advanced variation'
  ],
  instructions: [
    'Kneel on a mat with the ab roller in front of you',
    'Grasp the handles with both hands, arms straight',
    'Slowly roll forward, extending your body',
    'Keep core tight throughout the movement',
    'Use core strength to pull yourself back to start'
  ],
  commonMistakes: [
    'Allowing lower back to sag',
    'Rolling out too far too soon',
    'Using momentum instead of control',
    'Not maintaining core engagement'
  ],
  targetMuscles: {
    primary: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondary: ['Latissimus Dorsi', 'Anterior Deltoids', 'Core Stabilizers']
  }
}; 