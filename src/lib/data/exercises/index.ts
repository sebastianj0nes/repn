import { abRoller } from './core/ab-roller';
import { crunches } from './core/crunches';
import { legRaises } from './core/leg-raises';
import { plank } from './core/plank';
import { russianTwists } from './core/russian-twists';

import { assistedPullUps } from './back/assisted-pull-ups';
import { bentOverRows } from './back/bent-over-rows';
import { deadlifts } from './back/deadlifts';
import { latPulldowns } from './back/lat-pulldowns';
import { pullUps } from './back/pull-ups';
import { seatedCableRows } from './back/seated-cable-rows';
import { shrugs } from './back/shrugs';
import { singleArmLatPulldown } from './back/single-arm-lat-pulldown';

import { barbellCurls } from './bicep/barbell-curls';
import { bicepCurlCable } from './bicep/bicep-curl-cable';
import { bicepCurlDumbbell } from './bicep/bicep-curl-dumbbell';
import { chinUps } from './bicep/chin-ups';
import { concentrationCurls } from './bicep/concentration-curls';
import { ezBarBicepCurl } from './bicep/ez-bar-bicep-curl';
import { hammerCurls } from './bicep/hammer-curls';
import { preacherCurls } from './bicep/preacher-curls';

import { benchPressBarbell } from './chest/bench-press-barbell';
import { benchPressDumbbell } from './chest/bench-press-dumbbell';
import { cableFlyes } from './chest/cable-flyes';
import { declineBenchPress } from './chest/decline-bench-press';
import { dumbbellFlyes } from './chest/dumbbell-flyes';
import { inclineBenchPress } from './chest/incline-bench-press';
import { pushUps } from './chest/push-ups';

import { facePulls } from './shoulder/face-pulls';
import { frontRaises } from './shoulder/front-raises';
import { lateralRaises } from './shoulder/lateral-raises';
import { rearDeltFlyes } from './shoulder/rear-delt-flyes';
import { shoulderPressBarbell } from './shoulder/shoulder-press-barbell';
import { shoulderPressDumbbell } from './shoulder/shoulder-press-dumbbell';

import { assistedDips } from './tricep/assisted-dips';
import { closeGripBench } from './tricep/close-grip-bench';
import { overheadTricepExtensions } from './tricep/overhead-tricep-extensions';
import { skullCrushers } from './tricep/skull-crushers';
import { tricepDips } from './tricep/tricep-dips';
import { tricepPushdowns } from './tricep/tricep-pushdowns';

import { boxJumps } from './legs/box-jumps';
import { bulgSplitSquat } from './legs/bulg-split-squat';
import { cableKickbacks } from './legs/cable-kickbacks';
import { calfRaises } from './legs/calf-raises';
import { hamstringCurl } from './legs/hamstring-curl';
import { hipThrusts } from './legs/hip-thrusts';
import { legExtensions } from './legs/leg-extensions';
import { legPress } from './legs/leg-press';
import { lunges } from './legs/lunges';
import { rdl } from './legs/rdl';
import { singleLegSquat } from './legs/single-leg-squat';
import { squats } from './legs/squats';

const exerciseDatabase = {
  'Ab Roller': abRoller,
  'Crunches': crunches,
  'Leg Raises': legRaises,
  'Planks': plank,
  'Russian Twists': russianTwists,
  
  'Assisted Pull-ups': assistedPullUps,
  'Barbell Rows': bentOverRows,
  'Deadlifts': deadlifts,
  'Lat Pulldowns': latPulldowns,
  'Pull-Ups': pullUps,
  'Seated Cable Rows': seatedCableRows,
  'Shrugs': shrugs,
  'Single Arm Lat Pulldown': singleArmLatPulldown,
  
  'Barbell Curls': barbellCurls,
  'Bicep Curl - Cable': bicepCurlCable,
  'Bicep Curl - Dumbbell': bicepCurlDumbbell,
  'Chin-Ups': chinUps,
  'Concentration Curls': concentrationCurls,
  'Ez-Bar Bicep Curl': ezBarBicepCurl,
  'Hammer Curls': hammerCurls,
  'Preacher Curls': preacherCurls,
  
  'Bench Press - Barbell': benchPressBarbell,
  'Bench Press - Dumbbell': benchPressDumbbell,
  'Cable Flyes': cableFlyes,
  'Decline Bench Press': declineBenchPress,
  'Dumbbell Flyes': dumbbellFlyes,
  'Incline Bench Press': inclineBenchPress,
  
  'Face Pulls': facePulls,
  'Front Raises': frontRaises,
  'Lateral Raises': lateralRaises,
  'Rear Delt Flyes': rearDeltFlyes,
  'Shoulder Press - Barbell': shoulderPressBarbell,
  'Shoulder Press - Dumbbell': shoulderPressDumbbell,
  'Push-Ups': pushUps,
  
  'Assisted Dips': assistedDips,
  'Close-Grip Bench Press': closeGripBench,
  'Overhead Tricep Extensions': overheadTricepExtensions,
  'Skull Crushers': skullCrushers,
  'Tricep Dips': tricepDips,
  'Tricep Pushdowns': tricepPushdowns,
  
  'Box Jumps': boxJumps,
  'Bulgarian Split Squat': bulgSplitSquat,
  'Cable Kickbacks': cableKickbacks,
  'Calf Raises': calfRaises,
  'Hamstring Curl': hamstringCurl,
  'Hip Thrusts': hipThrusts,
  'Leg Extensions': legExtensions,
  'Leg Press': legPress,
  'Lunges': lunges,
  'RDL - Romanian Deadlift': rdl,
  'Single-Leg Squat': singleLegSquat,
  'Squats': squats,
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