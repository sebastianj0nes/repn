import { abRoller } from './core/ab-roller';
import { assistedDips } from './tricep/assisted-dips';
import { assistedPullUps } from './back/assisted-pull-ups';
import { bentOverRows } from './back/bent-over-rows';
import { deadlifts } from './back/deadlifts';
import { latPulldowns } from './back/lat-pulldowns';
import { seatedCableRows } from './back/seated-cable-rows';
import { shrugs } from './back/shrugs';
import { singleArmLatPulldown } from './back/single-arm-lat-pulldown';
// import { barbellCurls } from './bicep/barbell-curls';
import { pullUps } from './back/pull-ups';
// Import other exercises...

const exerciseDatabase = {
  'Ab Roller': abRoller,
  'Assisted Dips': assistedDips,
  'Assisted Pull-ups': assistedPullUps,
  'Bent-Over Rows': bentOverRows,
  'Deadlifts': deadlifts,
  'Lat Pulldowns': latPulldowns,
  'Seated Cable Rows': seatedCableRows,
  'Shrugs': shrugs,
  'Single Arm Lat Pulldown': singleArmLatPulldown,
//   'Barbell Curls': barbellCurls,
  'Pull-Ups': pullUps,
  // Add more exercises with their exact names as keys
} as const;

export const getExerciseDetails = (exerciseName: string) => {
  const exercise = exerciseDatabase[exerciseName as keyof typeof exerciseDatabase];
  
  if (!exercise) {
    return {
      tier: 'C' as const,
      overview: 'Details coming soon...',
      keyPoints: ['Coming soon'],
      proTips: ['Coming soon']
    };
  }

  return exercise;
};