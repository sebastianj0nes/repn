import { ExerciseTemplate } from '@/lib/types/exercise';

export const lateralRaises: ExerciseTemplate = {
  id: 'lateral-raises',
  name: 'Lateral Raises',
  muscle_group: 'Shoulder',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'An isolation exercise that specifically targets the lateral deltoids, crucial for building shoulder width and stability.',
  keyPoints: [
    'Slight bend in elbows throughout',
    'Lead with elbows, not hands',
    'Control the descent',
    'Keep shoulders down and back'
  ],
  proTips: [
    'Start with lighter weights to perfect form',
    'Use partial reps for burnout sets',
    'Consider cable variations for constant tension',
    'Lean slightly forward to target middle delts'
  ],
  instructions: [
    'Stand with dumbbells at sides, palms facing in',
    'Keep slight bend in elbows',
    'Raise arms out to sides until parallel with ground',
    'Pause briefly at top',
    'Lower slowly and controlled'
  ],
  commonMistakes: [
    'Using momentum to swing weights',
    'Raising arms too high',
    'Shrugging shoulders',
    'Straightening arms completely'
  ],
  targetMuscles: {
    primary: ['Lateral Deltoids'],
    secondary: ['Anterior Deltoids', 'Trapezius', 'Rotator Cuff']
  }
}; 