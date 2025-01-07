import { ExerciseTemplate } from '@/lib/types/exercise';

export const shrugs: ExerciseTemplate = {
  id: 'shrugs',
  name: 'Shrugs',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'B',
  overview: 'Shrugs are an isolation exercise targeting the upper trapezius muscles. They are effective for building neck and upper back strength, improving posture, and developing the "yoke" area.',
  keyPoints: [
    'Hold weights at sides',
    'Lift shoulders straight up',
    'Hold briefly at top',
    'Lower with control'
  ],
  proTips: [
    'Avoid rolling shoulders',
    'Keep arms straight but not locked',
    'Focus on vertical movement only',
    'Use various grip positions'
  ],
  instructions: [
    'Stand holding weights at sides',
    'Keep arms straight and relaxed',
    'Elevate shoulders as high as possible',
    'Hold contraction briefly',
    'Lower shoulders with control'
  ],
  commonMistakes: [
    'Rolling shoulders',
    'Using momentum',
    'Moving arms instead of shoulders',
    'Not maintaining proper posture'
  ],
  targetMuscles: {
    primary: ['Upper Trapezius'],
    secondary: ['Middle Trapezius', 'Levator Scapulae']
  }
}; 