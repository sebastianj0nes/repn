'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Database } from '@/lib/database.types'
import { DumbbellIcon } from 'lucide-react'
import { ExerciseCard } from '@/components/ExerciseCard'
import { getExerciseStats } from '@/lib/api/exercises'
import { ExerciseTier } from '@/lib/types/exercise'
import { getExerciseDetails } from '@/lib/data/exercises'
import { FilterControls } from '@/components/exercises/FilterControls'
import { TierExplanationDialog } from '@/components/exercises/TierExplanationDialog'
import { FilterProvider } from '@/contexts/FilterContext'

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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All')
  const [selectedTier, setSelectedTier] = useState('All')
  const [sortBy, setSortBy] = useState('Name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)
  const [exerciseStats, setExerciseStats] = useState<Record<string, ExerciseStats>>({})
  
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [exercisesResponse, stats] = await Promise.all([
          supabase
            .from('exercises_library')
            .select('*')
            .order('name'),
          getExerciseStats(user.id)
        ])

        if (exercisesResponse.error) throw exercisesResponse.error
        
        // Map exercises and assign tiers based on exercise details
        const exercisesWithTiers = exercisesResponse.data.map(exercise => ({
          ...exercise,
          tier: getExerciseDetails(exercise.name).tier || 'C'
        }))

        setExercises(exercisesWithTiers)
        setExerciseStats(stats)
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
        
        <div className="mb-2">
          <TierExplanationDialog />
        </div>

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