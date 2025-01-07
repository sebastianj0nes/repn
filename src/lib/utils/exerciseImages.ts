const backExercises = {
  'Pull-Ups': '/exercises/pullup.gif',
  'Assisted Pull-ups': '/exercises/assistedPullUp.gif',
  'Lat Pulldowns': '/exercises/latPulldown.gif',
  'Bent-Over Rows': '/exercises/barbellRow.gif',
  'Single Arm Lat Pulldown': '/exercises/singlearmLatPulldown.gif',
  'Seated Cable Rows': '/exercises/cableRow.gif',
  'Shrugs': '/exercises/shrugs.gif',
  'Deadlifts': '/exercises/deadlift.png',
} as const;

const chestExercises = {
  'Bench Press - Barbell': '/exercises/barbellBench.gif',
  'Bench Press - Dumbbell': '/exercises/dumbbellBench.gif',
  'Incline Bench Press': '/exercises/inclineBenchPress.gif',
  'Decline Bench Press': '/exercises/declineBench.gif',
  'Dumbell Flyes': '/exercises/dumbellFly.gif',
  'Push-Ups': '/exercises/pushup.gif',
  'Cable Flyes': '/exercises/cableFly.gif',
} as const;

const shoulderExercises = {
  'Shoulder Press - Barbell': '/exercises/barbellShoulderPress.gif',
  'Shoulder Press - Dumbbell': '/exercises/dbShoulderPress.gif',
  'Lateral Raises': '/exercises/lateralRaise.gif',
  'Front Raises': '/exercises/frontRaise.gif',
  'Face Pulls': '/exercises/facePull.gif',
  'Rear Delt Flyes': '/exercises/rearDeltFly.gif',
} as const;

const bicepExercises = {
  'Barbell Curls': '/exercises/barbellCurl.gif',
  'Bicep Curl - Dumbbell': '/exercises/dumbbelBicepCurl.gif',
  'Hammer Curls': '/exercises/hammerCurl.gif',
  'Preacher Curls': '/exercises/preacherCurl.gif',
  'Ez-Bar Bicep Curl': '/exercises/ezBicepCurl.gif',
  'Bicep Curl - Cable': '/exercises/cableBicepCurl.gif',
  'Chin-Ups': '/exercises/chinUp.gif',
  'Concentration Curls': '/exercises/concCurl.gif',
} as const;

const tricepExercises = {
  'Tricep Pushdowns': '/exercises/tricepPushdown.gif',
  'Skull Crushers': '/exercises/skullCrusher.gif',
  'Tricep Dips': '/exercises/tricepDip.gif',
  'Assisted Dips': '/exercises/assistedDip.gif',
  'Close-Grip Bench Press': '/exercises/closeGripBench.gif',
  'Overhead Tricep Extensions': '/exercises/overheadTricepExtension.gif',
} as const;

const coreExercises = {
  'Ab Roller': '/exercises/abRoller.gif',
  'Planks': '/exercises/plank.gif',
  'Crunches': '/exercises/crunch.gif',
  'Russian Twists': '/exercises/russianTwist.gif',
  'Leg Raises': '/exercises/legRaise.gif',
} as const;

const legExercises = {
  'Squats': '/exercises/squat.gif',
  'Leg Press': '/exercises/legPress.gif',
  'Lunges': '/exercises/lunge.gif',
  'Calf Raises': '/exercises/calfRaise.gif',
  'Box Jumps': '/exercises/boxJump.gif',
  'Bulgarian Split Squat': '/exercises/bulgSplitSquat.gif',
  'Cable Kickbacks': '/exercises/cableKickback.gif',
  'Hamstring Curl': '/exercises/hamstringCurl.gif',
  'Hip Thrusts': '/exercises/hipThrust.gif',
  'Leg Extensions': '/exercises/legExtension.gif',
  'RDL - Romanian Deadlift': '/exercises/RDL.gif',
  'Single-Leg Squat': '/exercises/singleLegSquat.gif',
} as const;

const exerciseImageMap = {
  'Back': backExercises,
  'Chest': chestExercises,
  'Shoulder': shoulderExercises,
  'Bicep': bicepExercises,
  'Tricep': tricepExercises,
  'Core': coreExercises,
  'Legs': legExercises,
} as const;

export function getExerciseImage(exerciseName: string, muscleGroup: string): string {
  const muscleGroupImages = exerciseImageMap[muscleGroup as keyof typeof exerciseImageMap];
  if (!muscleGroupImages) return '';
  
  return (muscleGroupImages as Record<string, string>)[exerciseName] || '';
} 