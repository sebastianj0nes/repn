'use client'

import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Dumbbell, Flame, Calendar, TrendingUp, Award, Activity, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/app/UserContext' // Adjust the import path as needed
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

interface WorkoutStats {
  totalWorkouts: number
  mostFrequentMuscleGroup: string
  averageWorkoutsPerWeek: number
  longestStreak: number
  totalVolume: number
}

interface ExerciseProgress {
  date: string
  weight: number
}

export default function StatsPage() {
  const router = useRouter()
  const { session } = useContext(UserContext)
  const supabase = createClientComponentClient<Database>()
    const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    mostFrequentMuscleGroup: '',
    averageWorkoutsPerWeek: 0,
    longestStreak: 0,
    totalVolume: 0,
  })
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([])
  const [volumeByMuscleGroup, setVolumeByMuscleGroup] = useState<{ name: string; volume: number }[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [exercises, setExercises] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchStats(session.user.id)
    }
  }, [session])

  async function fetchStats(userId: string) {
    try {
      setLoading(true)
      // Fetch workout stats
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)

      if (workoutsError) throw workoutsError

      // Calculate workout stats
      const stats: WorkoutStats = {
        totalWorkouts: workouts.length,
        mostFrequentMuscleGroup: calculateMostFrequentMuscleGroup(workouts),
        averageWorkoutsPerWeek: calculateAverageWorkoutsPerWeek(workouts),
        longestStreak: calculateLongestStreak(workouts),
        totalVolume: await calculateTotalVolume(userId),
      }

      setWorkoutStats(stats)

      // Fetch exercises for the dropdown
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises_library')
        .select('name')
        .order('name')

      if (exercisesError) throw exercisesError

      setExercises(exercisesData.map(e => e.name))
      setSelectedExercise(exercisesData[0]?.name || '')

      // Fetch volume by muscle group
      const { data: volumeData, error: volumeError } = await supabase
        .from('workouts')
        .select(`
          exercises!inner(
            name,
            total_volume,
            exercises_library!inner(muscle_group)
          )
        `)
        .eq('user_id', userId)

      if (volumeError) throw volumeError

      const volumeByGroup = volumeData.flatMap(workout => workout.exercises).reduce((acc, exercise) => {
        const group = exercise.exercises_library[0].muscle_group
        acc[group] = (acc[group] || 0) + exercise.total_volume
        return acc
      }, {} as Record<string, number>)

      setVolumeByMuscleGroup(Object.entries(volumeByGroup).map(([name, volume]) => ({ name, volume })))

      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchExerciseProgress() {
      if (!selectedExercise) return

      const { data: exerciseSets, error } = await supabase
        .from('exercises')
        .select(`
          name,
          workout_id,
          workouts!inner(date),
          exercise_sets!inner(weight)
        `)
        .eq('name', selectedExercise)
        .order('workouts(date)', { ascending: true })

      if (error) {
        console.error('Error fetching exercise progress:', error)
        return
      }

      const progress = exerciseSets.flatMap((exercise: any) => 
        exercise.exercise_sets.map((set: any) => ({
          date: new Date(exercise.workouts.date).toLocaleDateString(),
          weight: set.weight,
        }))
      )

      setExerciseProgress(progress)
    }

    fetchExerciseProgress()
  }, [selectedExercise])

  const calculateMostFrequentMuscleGroup = (workouts: any[]) => {
    const muscleGroups = workouts.map(w => w.muscle_group)
    return muscleGroups.sort((a, b) =>
      muscleGroups.filter(v => v === a).length - muscleGroups.filter(v => v === b).length
    ).pop()
  }

  const calculateAverageWorkoutsPerWeek = (workouts: any[]) => {
    if (workouts.length === 0) return 0
    const firstWorkoutDate = new Date(workouts[0].date)
    const lastWorkoutDate = new Date(workouts[workouts.length - 1].date)
    const weeks = (lastWorkoutDate.getTime() - firstWorkoutDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    return workouts.length / weeks
  }

  const calculateLongestStreak = (workouts: any[]) => {
    if (workouts.length === 0) return 0
    let currentStreak = 1
    let longestStreak = 1
    let previousDate = new Date(workouts[0].date)

    for (let i = 1; i < workouts.length; i++) {
      const currentDate = new Date(workouts[i].date)
      const diffDays = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak++
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }
      } else {
        currentStreak = 1
      }

      previousDate = currentDate
    }

    return longestStreak
  }

  const calculateTotalVolume = async (userId: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        exercises (
          total_volume
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    return data.reduce((total, workout) => {
      return total + workout.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + (exercise.total_volume || 0)
      }, 0)
    }, 0)
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your stats</h1>
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Dumbbell className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Fitness Journey
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.totalWorkouts}</div>
                <Progress value={(workoutStats.totalWorkouts / 100) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Frequent Muscle Group</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{workoutStats.mostFrequentMuscleGroup}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Workouts Per Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.averageWorkoutsPerWeek.toFixed(1)}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.longestStreak} days</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume Lifted</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.totalVolume.toLocaleString()} kg</div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="exerciseProgress">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="exerciseProgress">Exercise Progress</TabsTrigger>
                <TabsTrigger value="volumeByMuscleGroup">Volume by Muscle Group</TabsTrigger>
              </TabsList>
              <TabsContent value="exerciseProgress">
                <div className="space-y-4">
                  <Select onValueChange={setSelectedExercise} value={selectedExercise}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((exercise) => (
                        <SelectItem key={exercise} value={exercise}>
                          {exercise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={exerciseProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="volumeByMuscleGroup">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeByMuscleGroup}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="volume" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}