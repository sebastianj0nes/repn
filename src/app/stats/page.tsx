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
  const [longestStreak, setLongestStreak] = useState(0)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }) // Keep descending order for display

      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError)
        return
      }

      setWorkouts(workoutsData)
      setTotalWorkouts(workoutsData.length)
      setLongestStreak(calculateLongestStreak(workoutsData))
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

  const calculateLongestStreak = (workouts: Workout[]): number => {
    if (workouts.length === 0) return 0;

    let currentStreak = 1;
    let longestStreak = 1;
    let previousDate = new Date(workouts[0].date);

    for (let i = 1; i < workouts.length; i++) {
      const currentDate = new Date(workouts[i].date);
      const diffDays = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else if (diffDays > 1) {
        currentStreak = 1;
      }

      previousDate = currentDate;
    }

    return longestStreak;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 p-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Your Workout Stats</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart2Icon className="w-8 h-8 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                    <p className="text-2xl font-bold">{totalWorkouts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CalendarIcon className="w-8 h-8 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Longest Streak</p>
                    <p className="text-2xl font-bold">{longestStreak} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid grid-cols-2 gap-4">
              {filteredWorkouts.map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-32 flex flex-col items-center justify-center text-center">
                    <CardContent className="p-2">
                      <p className="text-xs text-muted-foreground mb-1">{workout.muscle_group}</p>
                      <p className="text-lg font-bold mb-1">
                        {new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  )
}