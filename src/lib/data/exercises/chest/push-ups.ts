import { ExerciseTemplate } from "@/lib/types/exercise"

export const pushUps: ExerciseTemplate = {
  id: 'push-ups',
  name: 'Push-Ups',
  muscle_group: 'Chest',
  exercise_type: 'bodyweight',
  tier: 'A',
  overview: 'Push-ups are a fundamental bodyweight exercise that primarily targets the chest, shoulders, and triceps. This compound movement also engages the core and promotes overall upper body strength and stability.',
  keyPoints: [
    'Start in a high plank position with hands slightly wider than shoulders',
    'Keep your body in a straight line from head to heels',
    'Lower your chest to the ground by bending your elbows',
    'Push back up to the starting position while maintaining form',
    'Keep core engaged throughout the movement'
  ],
  proTips: [
    'Focus on a full range of motion - chest should nearly touch the ground',
    'Keep elbows at about 45 degrees to your body, not flared out',
    'Breathe in while lowering, out while pushing up',
    'For better chest activation, think about pushing your hands together (without actually moving them)'
  ],
  instructions: [
    'Position hands slightly wider than shoulders',
    'Maintain straight body alignment',
    'Lower chest to ground with controlled movement',
    'Push back up explosively',
    'Repeat while maintaining proper form'
  ],
  commonMistakes: [
    'Sagging hips/lower back',
    'Flared elbows',
    'Incomplete range of motion',
    'Head dropping forward',
    'Not engaging core'
  ],
  targetMuscles: {
    primary: ['Chest', 'Shoulders', 'Triceps'],
    secondary: ['Core', 'Serratus Anterior']
  }
} 