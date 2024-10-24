'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon, BarChart2Icon, DumbbellIcon, CalendarIcon, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import BottomNav from '@/components/BottomNav'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type Workout = Database['public']['tables']['workouts']['Row']
type Exercise = Database['public']['tables']['exercises']['Row']
type ExerciseSet = Database['public']['tables']['exercise_sets']['Row']

export default function StatsPage() {
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>("all")
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [longestStreak, setLongestStreak] = useState(0)
  const [isWorkoutSectionOpen, setIsWorkoutSectionOpen] = useState(true)
  const [isExerciseSectionOpen, setIsExerciseSectionOpen] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [exerciseData, setExerciseData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [exercises, setExercises] = useState<{ id: string, name: string, muscle_group: string }[]>([])

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

  useEffect(() => {
    const fetchExercises = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: completedExercises, error: completedExercisesError } = await supabase
        .from('exercises')
        .select(`
          name,
          workouts!inner(user_id)
        `)
        .eq('workouts.user_id', user.id)
        .not('max_weight', 'is', null) // Check for non-null max_weight

      if (completedExercisesError) {
        console.error('Error fetching completed exercises:', completedExercisesError)
        return
      }

      // Use JavaScript to group exercises by name
      const groupedExercises = completedExercises.reduce((acc: { name: string }[], exercise) => {
        if (!acc.some(e => e.name === exercise.name)) {
          acc.push(exercise)
        }
        return acc
      }, [])

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises_library')
        .select('id, name, muscle_group, exercise_type')
        .eq('exercise_type', 'weights')

      if (exercisesError) {
        console.error('Error fetching exercises:', exercisesError)
        return
      }

      // Filter out exercises with muscle group "Core" and only include completed exercises
      const filteredExercises = exercisesData.filter(exercise => 
        exercise.muscle_group.toLowerCase() !== 'core' &&
        groupedExercises.some(completed => completed.name === exercise.name)
      )

      setExercises(filteredExercises)
    }

    fetchExercises()
  }, [supabase])

  useEffect(() => {
    if (selectedExercise) {
      fetchExerciseData()
    }
  }, [selectedExercise])

  const fetchExerciseData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercises')
      .select(`
        max_weight,
        workouts (date)
      `)
      .eq('name', selectedExercise)
      .eq('workouts.user_id', user.id)

    if (exerciseError) {
      console.error('Error fetching exercise data:', exerciseError)
      setLoading(false)
      return
    }

    const formattedData = exerciseData
      .map((exercise: any) => ({
        date: exercise.workouts.date,
        weight: exercise.max_weight
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending

    setExerciseData(formattedData)
    setLoading(false)
  }

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
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Workouts by Muscle Group</h2>
            <button
              onClick={() => setIsWorkoutSectionOpen(!isWorkoutSectionOpen)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isWorkoutSectionOpen ? (
                <ChevronUpIcon className="w-6 h-6" />
              ) : (
                <ChevronDownIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {isWorkoutSectionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
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
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Exercise Progress Tracker</h2>
            <button
              onClick={() => setIsExerciseSectionOpen(!isExerciseSectionOpen)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isExerciseSectionOpen ? (
                <ChevronUpIcon className="w-6 h-6" />
              ) : (
                <ChevronDownIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {isExerciseSectionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Select onValueChange={(value) => setSelectedExercise(value)} defaultValue="">
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {Object.entries(groupExercisesByMuscle(exercises)).map(([muscleGroup, exercises]) => (
                      <div key={muscleGroup}>
                        <div className="font-bold">{muscleGroup}</div>
                        {exercises.map((exercise) => (
                          <SelectItem key={exercise.id} value={exercise.name}>
                            {exercise.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <DumbbellIcon className="animate-spin w-12 h-12 text-primary" />
                  </div>
                ) : (
                  selectedExercise && (
                    <Card className="w-full max-w-[100vw]">
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={exerciseData}>
                            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  )
}

const groupExercisesByMuscle = (exercises: { id: string, name: string, muscle_group: string }[]) => {
  return exercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscle_group]) {
      acc[exercise.muscle_group] = []
    }
    acc[exercise.muscle_group].push(exercise)
    return acc
  }, {} as Record<string, { id: string, name: string, muscle_group: string }[]>)
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md rounded">
        <p className="label">{`Date: ${new Date(payload[0].payload.date).toLocaleDateString()}`}</p>
        <p className="intro">{`Weight: ${payload[0].value} kg`}</p>
      </div>
    )
  }

  return null
}
