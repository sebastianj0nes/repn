import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { useWorkouts } from './useWorkouts'

type Workout = Database['public']['tables']['workouts']['Row']

export function useAddWorkout() {
  const { mutate } = useWorkouts()
  const supabase = createClientComponentClient<Database>()

  const addWorkout = async (newWorkout: Omit<Workout, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('workouts')
      .insert({ ...newWorkout, user_id: user.id })
      .select()
      .single()

    if (error) throw error

    // Update the cache
    mutate((currentWorkouts) => [data, ...(currentWorkouts || [])], false)

    return data
  }

  return { addWorkout }
}
