import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

export async function getExerciseStats(userId: string) {
  const supabase = createClientComponentClient<Database>()
  
  // First, get the distinct exercise_ids this user has done
  const { data: userExercises } = await supabase
    .from('exercises')
    .select('exercise_id, max_weight, total_volume')
    .eq('workout_id', (
      supabase
        .from('workouts')
        .select('id')
        .eq('user_id', userId)
    ))

  if (!userExercises?.length) return {}

  // Create a map of exercise stats
  const statsMap: Record<string, {
    total_sessions: number
    max_weight: number
    total_volume: number
    last_performed: string
  }> = {}

  userExercises.forEach(exercise => {
    const exerciseId = exercise.exercise_id
    if (!statsMap[exerciseId]) {
      statsMap[exerciseId] = {
        total_sessions: 1,
        max_weight: exercise.max_weight || 0,
        total_volume: exercise.total_volume || 0,
        last_performed: '' // We'll update this next
      }
    } else {
      statsMap[exerciseId].total_sessions++
      statsMap[exerciseId].max_weight = Math.max(statsMap[exerciseId].max_weight, exercise.max_weight || 0)
      statsMap[exerciseId].total_volume += exercise.total_volume || 0
    }
  })

  // Get last performed dates in a single query
  const { data: lastPerformed } = await supabase
    .from('workouts')
    .select('date, exercises!inner(exercise_id)')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  lastPerformed?.forEach(workout => {
    workout.exercises.forEach((exercise: any) => {
      if (statsMap[exercise.exercise_id] && !statsMap[exercise.exercise_id].last_performed) {
        statsMap[exercise.exercise_id].last_performed = workout.date
      }
    })
  })

  return statsMap
} 