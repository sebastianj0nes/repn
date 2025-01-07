'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database } from '@/lib/database.types'
import Image from 'next/image'
import { DumbbellIcon } from 'lucide-react'
import { ExerciseCard } from '@/components/ExerciseCard'
import { getExerciseStats } from '@/lib/api/exercises'

interface Exercise {
  id: string
  name: string
  muscle_group: string
  image_url: string
  exercise_type: 'weights' | 'bodyweight' | 'time'
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
  const [loading, setLoading] = useState(true)
  const [exerciseStats, setExerciseStats] = useState<Record<string, ExerciseStats>>({})
  
  const supabase = createClientComponentClient<Database>()

  const muscleGroups = [
    'All',
    'Back',
    'Bicep',
    'Shoulder',
    'Tricep',
    'Chest',
    'Core',
    'Legs'
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch exercises and stats in parallel
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
        setExercises(exercisesResponse.data || [])
        setExerciseStats(stats)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredExercises = selectedMuscleGroup === 'All' 
    ? exercises
    : exercises.filter(ex => ex.muscle_group === selectedMuscleGroup)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DumbbellIcon className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Exercise Library</h1>
      
      <Tabs defaultValue="All" className="w-full">
        <ScrollArea className="w-full">
          <TabsList 
            className="w-full justify-start bg-white p-1 gap-1 flex overflow-x-auto hide-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {muscleGroups.map((group) => (
              <TabsTrigger
                key={group}
                value={group}
                onClick={() => setSelectedMuscleGroup(group)}
                className="flex-shrink-0 px-4 py-2.5 
                          bg-white text-foreground
                          data-[state=active]:bg-black data-[state=active]:text-white
                          hover:bg-gray-100 data-[state=active]:hover:bg-black/90
                          transition-all duration-200 ease-in-out
                          rounded-md font-medium min-w-fit"
              >
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value={selectedMuscleGroup} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  stats={exerciseStats[exercise.id]}
                />
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 