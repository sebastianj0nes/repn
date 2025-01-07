export type MuscleGroup = 'Back' | 'Bicep' | 'Shoulder' | 'Tricep' | 'Chest' | 'Core' | 'Legs';
export type ExerciseTier = 'S' | 'A' | 'B' | 'C' | 'D';
export type ExerciseType = 'weights' | 'bodyweight' | 'time';

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  exercise_type: ExerciseType;
  tier: ExerciseTier;
  overview: string;
  keyPoints: string[];
  proTips: string[];
  instructions: string[];
  commonMistakes: string[];
  targetMuscles: {
    primary: string[];
    secondary: string[];
  };
}

export const getTierColor = (tier: ExerciseTier): string => ({
  'S': '#FF4081',
  'A': '#7C4DFF',
  'B': '#448AFF',
  'C': '#69F0AE',
  'D': '#FF9100'
})[tier];

// Example template for an exercise
export const exerciseTemplate: ExerciseTemplate = {
  id: '',
  name: 'Exercise Name',
  muscle_group: 'Back',
  exercise_type: 'weights',
  tier: 'S',
  overview: `
    Provide a comprehensive overview of the exercise here. Include:
    - What muscles it targets
    - Why it's beneficial
    - When to use this exercise
    - Any prerequisites or warnings
  `,
  keyPoints: [
    'Starting position and setup',
    'Movement pattern and execution',
    'Breathing pattern',
    'Range of motion',
    'Common mistakes to avoid'
  ],
  proTips: [
    'Advanced technique tip',
    'Form optimization',
    'Progressive overload strategy',
    'Mind-muscle connection cue'
  ],
  instructions: [],
  commonMistakes: [],
  targetMuscles: {
    primary: [],
    secondary: []
  }
}; 