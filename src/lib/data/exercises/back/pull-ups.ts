import { ExerciseTemplate } from '@/lib/types/exercise';

export const pullUps: ExerciseTemplate = {
  id: 'pull-ups',
  name: 'Pull-Ups',
  muscle_group: 'Back',
  exercise_type: 'bodyweight',
  tier: 'S',
  overview: 'One of the most effective upper body exercises, developing exceptional back strength and overall pulling power.',
  keyPoints: [
    'Start from dead hang position',
    'Pull chin over bar',
    'Keep core tight throughout',
    'Control descent completely'
  ],
  proTips: [
    'Practice scapular pulls for better activation',
    'Use different grip widths for variety',
    'Add weight once mastered',
    'Focus on quality over quantity'
  ],
  instructions: [
    'Grip bar slightly wider than shoulders',
    'Engage lats before pulling',
    'Drive elbows down and back',
    'Pull until chin clears bar',
    'Lower with control to full extension'
  ],
  commonMistakes: [
    'Kipping or swinging',
    'Not completing full range of motion',
    'Using too much bicep',
    'Rushing the negative portion'
  ],
  targetMuscles: {
    primary: ['Latissimus Dorsi', 'Teres Major'],
    secondary: ['Biceps', 'Forearms', 'Core']
  }
}; 