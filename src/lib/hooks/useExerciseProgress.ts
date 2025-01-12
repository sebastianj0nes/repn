import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/lib/database.types'
import { format } from 'date-fns'

type WorkoutData = {
  max_weight: number;
  exercise_sets: { duration: number; weight: number; reps: number; }[];
  workouts: {
    date: string;
    feeling: string;
  };
}

type TimeExercise = { duration: number; date: string; displayDate: string };
type WeightExercise = { weight: number; date: string; displayDate: string };

type ExerciseStats = {
  startValue: number;
  currentValue: number;
  peakValue: number;
  progressPercentage: number;
  peakPercentage: number;
  unit: string;
}

type ExerciseProgressReturn = {
  data: (TimeExercise | WeightExercise)[];
  stats: ExerciseStats | null;
  exerciseType: string | null;
}

export function useExerciseProgress(exercise: { id: string, name: string }, isDialogOpen: boolean) {
  const supabase = createClientComponentClient<Database>()

  return useQuery<ExerciseProgressReturn>({
    queryKey: ['exerciseProgress', exercise.name],
    queryFn: async () => {
      if (!exercise.name) return { data: [], stats: null, exerciseType: null }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: [], stats: null, exerciseType: null }

        const { data: exerciseInfo } = await supabase
          .from('exercises_library')
          .select('exercise_type')
          .eq('name', exercise.name)
          .single()

        const { data: exerciseData, error } = await supabase
          .from('exercises')
          .select(`
            max_weight,
            exercise_sets (
              duration,
              weight,
              reps
            ),
            workouts (
              date,
              feeling
            )
          `)
          .eq('name', exercise.name)
          .eq('workouts.user_id', user.id)

        if (error) throw error

        const formattedData = (exerciseData as unknown as WorkoutData[])
          .filter(exercise => exercise.workouts)
          .map(exercise => {
            const baseData = {
              date: exercise.workouts.date,
              displayDate: format(new Date(exercise.workouts.date), 'MMM d')
            }

            if (exerciseInfo?.exercise_type === 'time') {
              const maxDuration = Math.max(...(exercise.exercise_sets?.map(set => set.duration || 0) ?? [0]))
              return {
                ...baseData,
                duration: maxDuration
              }
            } else {
              return {
                ...baseData,
                weight: exercise.max_weight
              }
            }
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        if (formattedData.length === 0) {
          return { data: [], stats: null, exerciseType: exerciseInfo?.exercise_type }
        }

        const first = formattedData[0]
        const latest = formattedData[formattedData.length - 1]

        const stats = exerciseInfo?.exercise_type === 'time' 
          ? {
              startValue: (first as TimeExercise).duration,
              currentValue: (latest as TimeExercise).duration,
              peakValue: Math.max(...(formattedData as TimeExercise[]).map(d => d.duration)),
              progressPercentage: Math.round(((latest as TimeExercise).duration - (first as TimeExercise).duration) / (first as TimeExercise).duration * 100),
              peakPercentage: Math.round((Math.max(...(formattedData as TimeExercise[]).map(d => d.duration)) - (first as TimeExercise).duration) / (first as TimeExercise).duration * 100),
              unit: 'seconds'
            } as ExerciseStats
          : {
              startValue: (first as WeightExercise).weight,
              currentValue: (latest as WeightExercise).weight,
              peakValue: Math.max(...(formattedData as WeightExercise[]).map(d => d.weight)),
              progressPercentage: Math.round(((latest as WeightExercise).weight - (first as WeightExercise).weight) / (first as WeightExercise).weight * 100),
              peakPercentage: Math.round((Math.max(...(formattedData as WeightExercise[]).map(d => d.weight)) - (first as WeightExercise).weight) / (first as WeightExercise).weight * 100),
              unit: 'kg'
            } as ExerciseStats

        return {
          data: formattedData,
          stats,
          exerciseType: exerciseInfo?.exercise_type
        }
      } catch (error) {
        console.error('Error fetching exercise progress:', error)
        return { data: [], stats: null, exerciseType: null }
      }
    },
    enabled: isDialogOpen,
    staleTime: 1000 * 60 * 5
  })
} 