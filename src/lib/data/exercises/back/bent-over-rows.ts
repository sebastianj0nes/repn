import { ExerciseTemplate } from '@/lib/types/exercise';

export const bentOverRows: ExerciseTemplate = {
  id: 'bent-over-rows',
  name: 'Bent-Over Rows',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'S',
  overview: 'Bent-over rows are a fundamental back exercise that targets multiple muscles in the back while improving posture and core stability. This compound movement is essential for building back thickness and strength.',
  keyPoints: [
    'Hinge at hips with flat back',
    'Keep core braced throughout',
    'Pull weight to lower chest/upper abdomen',
    'Squeeze shoulder blades together at top'
  ],
  proTips: [
    'Focus on pulling with elbows, not hands',
    'Maintain neutral spine position',
    'Control the eccentric portion',
    'Keep upper body still - avoid swinging'
  ],
  instructions: [
    'Stand with feet shoulder-width apart',
    'Bend at hips until torso is nearly parallel to floor',
    'Grip barbell with hands slightly wider than shoulder width',
    'Pull bar to lower chest while keeping elbows close',
    'Lower weight with control to starting position'
  ],
  commonMistakes: [
    'Rounding the back',
    'Using momentum to lift weight',
    'Not maintaining hip hinge',
    'Pulling too high or too low'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
    secondary: ['Rear Deltoids', 'Biceps', 'Core']
  }
}; 