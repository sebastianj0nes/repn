import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import useSWR from 'swr'

type Workout = Database['public']['tables']['workouts']['Row']

const fetcher = async (): Promise<Workout[]> => {
  const supabase = createClientComponentClient<Database>()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

export function useWorkouts() {
  const { data, error, mutate } = useSWR<Workout[]>('workouts', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 60000 // Revalidate every minute
  })

  return {
    workouts: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
