import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { date, muscle_group, feeling, sotd, image_url, exercises } = await request.json();

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .insert({ user_id: user.id, date, muscle_group, feeling, sotd, image_url })
    .select()
    .single();

  if (workoutError) {
    return NextResponse.json({ error: workoutError.message }, { status: 500 });
  }

  for (const exercise of exercises) {
    const sets = exercise.sets;
    const maxWeight = Math.max(...sets.map((set: { weight: number }) => set.weight));
    const totalVolume = sets.reduce((sum: number, set: { weight: number, reps: number }) => sum + set.weight * set.reps, 0);
    const totalSets = sets.length;

    const { error: exerciseError } = await supabase
      .from('exercises')
      .insert({
        workout_id: workout.id,
        exercise_id: exercise.id,
        max_weight: maxWeight,
        total_volume: totalVolume,
        total_sets: totalSets
      });

    if (exerciseError) {
      return NextResponse.json({ error: exerciseError.message }, { status: 500 });
    }

    for (const set of sets) {
      const { error: setError } = await supabase
        .from('exercise_sets')
        .insert({
          exercise_id: exercise.id,
          set_number: set.set_number,
          weight: set.weight,
          reps: set.reps,
          duration: set.duration // Add this line to include duration
        });

      if (setError) {
        return NextResponse.json({ error: setError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true, workout_id: workout.id });
}
