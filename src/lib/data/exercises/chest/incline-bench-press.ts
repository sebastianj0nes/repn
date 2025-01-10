import { ExerciseTemplate } from '@/lib/types/exercise';

export const inclineBenchPress: ExerciseTemplate = {
  id: 'incline-bench-press',
  name: 'Incline Bench Press',
  muscle_group: 'Chest',
  exercise_type: 'weights',
  tier: 'A*',
  overview: 'A compound movement that targets the upper chest while engaging shoulders and triceps.',
  keyPoints: [
    'Set bench angle 30-45 degrees',
    'Retract shoulder blades',
    'Control bar path',
    'Full range of motion'
  ],
  proTips: [
    'Experiment with angles',
    'Keep shoulders down',
    'Use spotter for heavy sets',
    'Focus on upper chest'
  ],
  instructions: [
    'Lie on incline bench',
    'Grip bar slightly wider than shoulders',
    'Lower bar to upper chest',
    'Press to lockout',
    'Control the descent'
  ],
  commonMistakes: [
    'Bench angle too steep',
    'Bouncing bar',
    'Flaring elbows',
    'Losing shoulder position'
  ],
  targetMuscles: {
    primary: ['Upper Pectoralis Major'],
    secondary: ['Anterior Deltoids', 'Triceps']
  }
}; 