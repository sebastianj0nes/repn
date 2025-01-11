import { useQuery } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

type ExerciseSet = {
  set_number: number
  weight?: number
  reps?: number
  duration?: number
  is_dropset: boolean
  dropset_weight?: number
  dropset_reps?: number
}

type ExerciseHistory = {
  id: string
  workout_id: string
  workout_date: string
  workout_feeling: string
  sets: ExerciseSet[]
}

type ExerciseHistoryResponse = {
  id: string
  workout_id: string
  workouts: {
    date: string
    feeling: string
  }
  exercise_sets: {
    id: string
    set_number: number
    weight: number | null
    reps: number | null
    duration: number | null
    is_dropset: boolean
    dropset_weight: number | null
    dropset_reps: number | null
  }[]
}

export function useExerciseHistory(exercise: { id: string, name: string }, isDialogOpen: boolean) {
  const supabase = createClientComponentClient<Database>()

  return useQuery({
    queryKey: ['exerciseHistory', exercise.id],
    queryFn: async () => {
      if (!exercise.name) return []

      try {
        const { data: libraryEntry, error: libraryError } = await supabase
          .from('exercises_library')
          .select('id')
          .eq('name', exercise.name)
          .single()

        if (libraryError) {
          console.error(`No exercise found with name: ${exercise.name}`)
          return []
        }

        const { data: exerciseHistory, error: historyError } = await supabase
          .from('exercises')
          .select(`
            id,
            workout_id,
            workouts!inner (
              date,
              feeling
            ),
            exercise_sets (
              id,
              set_number,
              weight,
              reps,
              duration,
              is_dropset,
              dropset_weight,
              dropset_reps
            )
          `)
          .eq('exercise_id', libraryEntry.id)
          .order('workout_id', { ascending: false })

        if (historyError) {
          console.error('History fetch failed:', historyError)
          return []
        }

        console.log('Raw exercise history:', exerciseHistory?.[0])

        const formattedHistory = (exerciseHistory as unknown as ExerciseHistoryResponse[])?.map(entry => {
          const rawDate = entry.workouts?.date
          console.log('Processing date:', rawDate)

          if (!rawDate) return {
            id: entry.id,
            workout_id: entry.workout_id,
            workout_date: 'No Date',
            workout_feeling: entry.workouts?.feeling ?? '',
            sets: entry.exercise_sets ?? []
          }

          const dateObj = new Date(rawDate)
          const formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })

          return {
            id: entry.id,
            workout_id: entry.workout_id,
            workout_date: formattedDate,
            workout_feeling: entry.workouts?.feeling ?? '',
            sets: entry.exercise_sets ?? []
          }
        }).sort((a, b) => {
          const dateA = new Date(a.workout_date)
          const dateB = new Date(b.workout_date)
          return dateB.getTime() - dateA.getTime()
        }) ?? []

        console.log('First formatted entry:', formattedHistory[0])
        return formattedHistory
      } catch (error) {
        console.error('Error in history fetch:', error)
        return []
      }
    },
    enabled: !!exercise.name && isDialogOpen,
    staleTime: 1000 * 60 * 5
  })
} 