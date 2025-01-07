import { ExerciseTemplate } from '@/lib/types/exercise';

export const ezBarBicepCurl: ExerciseTemplate = {
  id: 'ez-bar-bicep-curl',
  name: 'Ez-Bar Bicep Curl',
  muscle_group: 'Bicep',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'A bicep exercise using an angled bar that provides a more natural grip position and reduces wrist strain.',
  keyPoints: [
    'Keep elbows close to body',
    'Maintain straight back',
    'Use controlled motion',
    'Full range of movement'
  ],
  proTips: [
    'Try different grip positions',
    'Focus on squeezing at top',
    'Keep core engaged',
    'Use preacher bench variation'
  ],
  instructions: [
    'Stand with feet shoulder-width',
    'Grip ez-bar at angled sections',
    'Keep upper arms stationary',
    'Curl bar to shoulders',
    'Lower with control'
  ],
  commonMistakes: [
    'Swinging the weight',
    'Moving elbows forward',
    'Using excessive back motion',
    'Incomplete range of motion'
  ],
  targetMuscles: {
    primary: ['Biceps Brachii'],
    secondary: ['Brachialis', 'Forearm Flexors']
  }
}; 