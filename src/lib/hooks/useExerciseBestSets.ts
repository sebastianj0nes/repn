import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/lib/database.types'

type BestSet = {
  reps: number
  weight: number
}

export function useExerciseBestSets(exercise: { id: string, name: string }, isDialogOpen: boolean) {
  const supabase = createClientComponentClient<Database>()

  return useQuery({
    queryKey: ['exerciseBestSets', exercise.id],
    queryFn: async () => {
      if (!exercise.name) return []

      try {
        const { data: libraryEntry, error: libraryError } = await supabase
          .from('exercises_library')
          .select('id')
          .eq('name', exercise.name)
          .single()

        if (libraryError) return []

        const { data: exercises, error } = await supabase
          .from('exercises')
          .select(`
            id,
            exercise_sets (
              weight,
              reps
            )
          `)
          .eq('exercise_id', libraryEntry.id)

        if (error) throw error

        // Process the data to find best sets for each rep range
        const lowRepSets: Record<number, BestSet> = {}  // 1-3 reps
        const highRepSets: Record<number, BestSet> = {} // 8-12 reps
        
        exercises?.forEach(exercise => {
          exercise.exercise_sets?.forEach(set => {
            if (set.reps && set.weight) {
              // Handle low rep ranges (1-3)
              if (set.reps <= 3) {
                if (!lowRepSets[set.reps] || lowRepSets[set.reps].weight < set.weight) {
                  lowRepSets[set.reps] = {
                    reps: set.reps,
                    weight: set.weight
                  }
                }
              }
              // Handle high rep ranges (8, 10, 12)
              if (set.reps === 8 || set.reps === 10 || set.reps === 12) {
                if (!highRepSets[set.reps] || highRepSets[set.reps].weight < set.weight) {
                  highRepSets[set.reps] = {
                    reps: set.reps,
                    weight: set.weight
                  }
                }
              }
            }
          })
        })

        // Choose which set of records to return
        const lowRepResults = Object.values(lowRepSets).sort((a, b) => a.reps - b.reps)
        const highRepResults = Object.values(highRepSets).sort((a, b) => a.reps - b.reps)

        // If we have enough low rep records, use those
        if (lowRepResults.length >= 2) {
          return lowRepResults.slice(0, 3)
        }
        
        // Otherwise, use high rep records
        return highRepResults.slice(0, 3)
      } catch (error) {
        console.error('Error fetching best sets:', error)
        return []
      }
    },
    enabled: isDialogOpen,
    staleTime: 1000 * 60 * 5
  })
} 