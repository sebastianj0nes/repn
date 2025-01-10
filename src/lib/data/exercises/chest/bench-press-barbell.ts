import { ExerciseTemplate } from '@/lib/types/exercise';

export const benchPressBarbell: ExerciseTemplate = {
  id: 'bench-press-barbell',
  name: 'Bench Press - Barbell',
  muscle_group: 'Chest',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'The king of chest exercises, barbell bench press is a compound movement that builds overall upper body strength and muscle mass.',
  keyPoints: [
    'Retract shoulder blades',
    'Keep feet firmly planted',
    'Maintain natural arch in lower back',
    'Control bar path'
  ],
  proTips: [
    'Use spotter for heavy sets',
    'Drive feet into ground for stability',
    'Vary grip width for different emphasis',
    'Practice proper unrack position'
  ],
  instructions: [
    'Lie on bench, eyes under bar',
    'Grip bar slightly wider than shoulders',
    'Unrack and hold with straight arms',
    'Lower bar to mid-chest',
    'Press up in slight arc toward head'
  ],
  commonMistakes: [
    'Bouncing bar off chest',
    'Flaring elbows excessively',
    'Lifting hips off bench',
    'Inconsistent bar path'
  ],
  targetMuscles: {
    primary: ['Pectoralis Major', 'Anterior Deltoids'],
    secondary: ['Triceps', 'Serratus Anterior']
  }
}; 