'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDownIcon, BarChart2Icon, DumbbellIcon, CalendarIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BottomNav from '@/components/BottomNav'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

type Workout = Database['public']['tables']['workouts']['Row']
type Exercise = Database['public']['tables']['exercises']['Row']

export default function StatsPage() {
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>("all")
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [debugInfo, setDebugInfo] = useState<string>('')

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError)
        return
      }

      setWorkouts(workoutsData)
      setTotalWorkouts(workoutsData.length)
    }

    fetchWorkouts()
  }, [supabase])

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulder', 'Core', 'Tricep', 'Bicep']

  const filteredWorkouts = selectedMuscleGroup === "all"
    ? workouts
    : workouts.filter(w => {
        const workoutMuscleGroups = w.muscle_group.split(',').map(group => group.trim().toLowerCase())
        return workoutMuscleGroups.includes(selectedMuscleGroup!.toLowerCase())
      })

  useEffect(() => {
    setDebugInfo(`Selected: ${selectedMuscleGroup}, Filtered: ${filteredWorkouts.length}, Total: ${workouts.length}`)
  }, [selectedMuscleGroup, filteredWorkouts, workouts])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 p-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Your Workout Stats</h1>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2Icon className="w-8 h-8 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                    <p className="text-2xl font-bold">{totalWorkouts}</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDownIcon className="w-6 h-6 text-muted-foreground" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-3">Workouts by Muscle Group</h2>
          <Select onValueChange={(value) => setSelectedMuscleGroup(value)} defaultValue="all">
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select muscle group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All muscle groups</SelectItem>
              {muscleGroups.map((group) => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Debug info */}
          <p className="text-sm text-muted-foreground mb-2">{debugInfo}</p>

          <ScrollArea className="h-[calc(100vh-300px)]">
            {filteredWorkouts.map((workout) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <DumbbellIcon className="w-5 h-5 mr-2 text-primary" />
                        <span className="font-medium">{workout.muscle_group}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm mb-2">Feeling: {workout.feeling}</p>
                    <p className="text-sm font-medium">Star of the Day: {workout.sotd}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </ScrollArea>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  )
}