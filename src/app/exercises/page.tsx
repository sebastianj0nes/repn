'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Database } from '@/lib/database.types'
import { DumbbellIcon } from 'lucide-react'
import { ExerciseCard } from '@/components/ExerciseCard'
import { ExerciseTier } from '@/lib/types/exercise'
import { getExerciseDetails } from '@/lib/data/exercises'
import { FilterControls } from '@/components/exercises/FilterControls'
import { TierExplanationDialog } from '@/components/exercises/TierExplanationDialog'
import { FilterProvider } from '@/contexts/FilterContext'
import { FilterSection } from '@/components/exercises/FilterSection'

interface Exercise {
  id: string
  name: string
  muscle_group: string
  image_url: string
  exercise_type: 'weights' | 'bodyweight' | 'time'
  tier: ExerciseTier
}

interface ExerciseStats {
  total_sessions: number
  max_weight: number
  total_volume: number
  last_performed: string
}

interface StatsData {
  workouts: any[];  // Using any[] since we only need the length
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All')
  const [selectedTier, setSelectedTier] = useState('All')
  const [sortBy, setSortBy] = useState('Name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)
  const [exerciseStats, setExerciseStats] = useState<Record<string, ExerciseStats>>({})
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<number>(0)
  
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get start of today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Get start of 7 days ago
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 6) // -6 to include today (making it 7 days total)

        const [exercisesResponse, statsResponse, weeklyWorkoutsResponse] = await Promise.all([
          supabase
            .from('exercises_library')
            .select('*')
            .order('name'),
          supabase.rpc('get_user_stats', {
            user_id: user.id
          }),
          supabase
            .from('workouts')
            .select('id, date')
            .gte('date', sevenDaysAgo.toISOString())
            .lt('date', new Date(today.getTime() + 24*60*60*1000).toISOString()) // Include full current day
            .eq('user_id', user.id)
        ])

        if (exercisesResponse.error) throw exercisesResponse.error
        if (statsResponse.error) throw statsResponse.error
        if (weeklyWorkoutsResponse.error) throw weeklyWorkoutsResponse.error
        
        setWeeklyWorkouts(weeklyWorkoutsResponse.data.length)
        const exercisesWithTiers = exercisesResponse.data.map(exercise => ({
          ...exercise,
          tier: getExerciseDetails(exercise.name).tier || 'C'
        }))

        setExercises(exercisesWithTiers)
        setStatsData(statsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredAndSortedExercises = exercises
    .filter(ex => 
      (selectedMuscleGroup === 'All' || ex.muscle_group === selectedMuscleGroup) &&
      (selectedTier === 'All' || ex.tier === selectedTier)
    )
    .sort((a, b) => {
      if (sortBy === 'Name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else {
        // Sort by tier (S > A > B)
        const tierOrder = { 'A*': 3, 'A': 2, 'B': 1 }
        const tierDiff = (tierOrder[b.tier as keyof typeof tierOrder] || 0) - 
                        (tierOrder[a.tier as keyof typeof tierOrder] || 0)
        return sortDirection === 'asc' ? -tierDiff : tierDiff
      }
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DumbbellIcon className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <FilterProvider>
      <div className="container mx-auto px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-4">Exercise Library</h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-4 text-center border border-primary/20">
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                Total Workouts
              </span>
              <div className="relative flex items-center justify-center w-full">
                <span className="text-3xl font-bold text-primary">
                  {statsData?.workouts?.length || 0}
                </span>
                {weeklyWorkouts > 0 && (
                  <span className="absolute right-6 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    +{weeklyWorkouts} in last 7 days 
                  </span>
                )}
                <div className="absolute -inset-1 bg-primary/5 blur-sm rounded-full -z-10" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-2">
          <TierExplanationDialog />
        </div>

        <FilterSection>
          <div className="space-y-4">
            <FilterControls
              selectedMuscleGroup={selectedMuscleGroup}
              selectedTier={selectedTier}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onMuscleGroupChange={setSelectedMuscleGroup}
              onTierChange={setSelectedTier}
              onSortChange={setSortBy}
              onSortDirectionChange={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            />
          </div>
        </FilterSection>

        <div className="pt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                stats={exerciseStats[exercise.id]}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </FilterProvider>
  )
} 