import { ExerciseTemplate } from '@/lib/types/exercise';

export const assistedPullUps: ExerciseTemplate = {
  id: 'assisted-pull-ups',
  name: 'Assisted Pull-ups',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A progression exercise that helps develop pull-up strength using counterweight assistance, perfect for building towards unassisted pull-ups.',
  keyPoints: [
    'Maintain controlled movement throughout',
    'Focus on full range of motion',
    'Keep core engaged',
    'Drive elbows down and back'
  ],
  proTips: [
    'Gradually decrease assistance weight',
    'Focus on eccentric (lowering) portion',
    'Practice scapular pulls between sets',
    'Keep shoulders away from ears'
  ],
  instructions: [
    'Select appropriate assistance weight',
    'Grip bar slightly wider than shoulders',
    'Start from dead hang position',
    'Pull up until chin clears bar',
    'Lower with control to starting position'
  ],
  commonMistakes: [
    'Relying too heavily on assistance',
    'Swinging or using momentum',
    'Incomplete range of motion',
    'Not engaging lats properly'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids'],
    secondary: ['Biceps', 'Rear Deltoids', 'Core']
  }
}; 