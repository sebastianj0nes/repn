'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon, BarChart2Icon, DumbbellIcon, CalendarIcon, Loader2, InfoIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import BottomNav from '@/components/BottomNav'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { Line, LineChart, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "@/components/ui/tooltip"
import { format, parseISO } from 'date-fns'
import { Gauge } from 'lucide-react'

type Workout = Database['public']['tables']['workouts']['Row']
type Exercise = Database['public']['tables']['exercises']['Row']
type ExerciseSet = Database['public']['tables']['exercise_sets']['Row']
type WeightData = {
  date: string
  weight: number
}

export default function StatsPage() {
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [longestStreak, setLongestStreak] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [exerciseData, setExerciseData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [exercises, setExercises] = useState<{ id: string, name: string, muscle_group: string }[]>([])
  const [holyTrinityStats, setHolyTrinityStats] = useState({
    bench: { totalReps: 0, maxWeight: 0 },
    squat: { totalReps: 0, maxWeight: 0 },
    deadlift: { totalReps: 0, maxWeight: 0 }
  })
  const [weightData, setWeightData] = useState<WeightData[]>([])

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

      // First, get all completed exercises for this user
      const { data: completedExercises, error: completedExercisesError } = await supabase
        .from('exercises')
        .select(`
          name,
          workouts!inner(user_id)
        `)
        .eq('workouts.user_id', user.id)

      if (completedExercisesError) {
        console.error('Error fetching completed exercises:', completedExercisesError)
        return
      }

      // Get all exercises from the library
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises_library')
        .select('id, name, muscle_group, exercise_type')
        .eq('exercise_type', 'weights')

      if (exercisesError) {
        console.error('Error fetching exercises:', exercisesError)
        return
      }

      // Filter exercises to only include those that have been completed by the user
      const filteredExercises = exercisesData.filter(exercise => 
        exercise.muscle_group.toLowerCase() !== 'core' &&
        completedExercises.some(completed => 
          completed.name.toLowerCase() === exercise.name.toLowerCase()
        )
      )

      console.log('Completed exercises:', completedExercises) // Debug log
      console.log('Filtered exercises:', filteredExercises) // Debug log

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

  useEffect(() => {
    const calculateHolyTrinityStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: holyTrinityData, error } = await supabase
        .from('exercises')
        .select(`
          name,
          max_weight,
          exercise_sets (reps),
          workouts!inner(user_id)
        `)
        .in('name', ['Bench Press - Barbell', 'Squats', 'Deadlifts'])
        .eq('workouts.user_id', user.id)

      if (error) {
        console.error('Error fetching holy trinity stats:', error)
        return
      }

      const stats = {
        bench: { totalReps: 0, maxWeight: 0 },
        squat: { totalReps: 0, maxWeight: 0 },
        deadlift: { totalReps: 0, maxWeight: 0 }
      }

      holyTrinityData?.forEach(exercise => {
        const totalReps = exercise.exercise_sets?.reduce((sum, set) => sum + (set.reps || 0), 0) || 0
        
        switch (exercise.name) {
          case 'Bench Press - Barbell':
            stats.bench.totalReps += totalReps
            stats.bench.maxWeight = Math.max(stats.bench.maxWeight, exercise.max_weight || 0)
            break
          case 'Squats':
            stats.squat.totalReps += totalReps
            stats.squat.maxWeight = Math.max(stats.squat.maxWeight, exercise.max_weight || 0)
            break
          case 'Deadlifts':
            stats.deadlift.totalReps += totalReps
            stats.deadlift.maxWeight = Math.max(stats.deadlift.maxWeight, exercise.max_weight || 0)
            break
        }
      })

      setHolyTrinityStats(stats)
    }

    calculateHolyTrinityStats()
  }, [supabase])

  useEffect(() => {
    const fetchWeightData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('workouts')
        .select('date, user_weight')
        .eq('user_id', user.id)
        .not('user_weight', 'is', null)
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching weight data:', error)
        return
      }

      const formattedData = data
        .filter(entry => entry.user_weight !== null)
        .map(entry => ({
          date: entry.date,
          weight: entry.user_weight
        }))

      setWeightData(formattedData)
    }

    fetchWeightData()
  }, [supabase])

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulder', 'Core', 'Tricep', 'Bicep']

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
          className="mt-8"
        >
          <div className="flex justify-center items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold text-center text-primary pb-4 pt-3">
              The Big Three
            </h2>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    The three main compound lifts in powerlifting: Squat, Bench Press, and Deadlift.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Squat', stats: holyTrinityStats.squat },
              { title: 'Bench', stats: holyTrinityStats.bench },
              { title: 'Deadlift', stats: holyTrinityStats.deadlift },
            ].map((lift) => (
              <motion.div
                key={lift.title}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-primary">{lift.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-3xl font-bold">{lift.stats.totalReps}</div>
                      <p className="text-sm text-muted-foreground">Total Reps</p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="text-2xl font-bold text-primary">{lift.stats.maxWeight}</div>
                      <p className="text-sm text-muted-foreground">Max Weight (kg)</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pb-16 mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-primary pb-4 pt-3">
            Exercise Progress Tracker
          </h2>

          <div className="w-full max-w-sm mx-auto mb-8">
            <Select
              value={selectedExercise}
              onValueChange={setSelectedExercise}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an exercise" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[300px]">
                  {Object.entries(groupExercisesByMuscle(exercises)).map(([muscleGroup, exercises]) => (
                    <div key={muscleGroup}>
                      <SelectItem
                        value={`group-${muscleGroup}`}
                        disabled
                        className="font-bold text-primary bg-muted/50 px-2 py-1.5"
                      >
                        {muscleGroup}
                      </SelectItem>
                      {exercises.map((exercise) => (
                        <SelectItem 
                          key={exercise.id} 
                          value={exercise.name}
                          className="pl-4 hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          {exercise.name}
                        </SelectItem>
                      ))}
                      <SelectItem value={`spacer-${muscleGroup}`} disabled className="h-2 py-0" />
                    </div>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <DumbbellIcon className="animate-spin w-12 h-12 text-primary" />
            </div>
          ) : (
            selectedExercise && (
              <Card className="w-full max-w-[100vw] mb-8">
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={exerciseData}>
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#8884d8" 
                      />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString()} 
                      />
                      <YAxis />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          padding: '8px'
                        }}
                        labelFormatter={(date: string) => format(parseISO(date), 'MMMM d, yyyy')}
                        formatter={(value: number) => [`${value}kg`, 'Weight']}
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )
          )}
        </motion.div>

        {/* Weight Tracking Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 mb-24"
        >
          <div className="flex justify-center items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold text-center text-primary">
              Weight Progress
            </h2>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Gauge className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Track your weight progress over time
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Card className="w-full p-4">
            <CardContent className="pt-4">
              {weightData.length > 0 ? (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weightData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `${value}kg`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          padding: '8px'
                        }}
                        labelFormatter={(date: string) => format(parseISO(date), 'MMMM d, yyyy')}
                        formatter={(value: number) => [`${value}kg`, 'Weight']}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{
                          stroke: '#8884d8',
                          strokeWidth: 2,
                          r: 4,
                          fill: 'hsl(var(--card))'
                        }}
                        activeDot={{
                          stroke: '#8884d8',
                          strokeWidth: 2,
                          r: 6,
                          fill: '#8884d8'
                        }}
                        connectNulls={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Gauge className="h-12 w-12 mb-4" />
                  <p>No weight data available</p>
                  <p className="text-sm">Start tracking your weight in your workouts to see your progress</p>
                </div>
              )}
            </CardContent>
          </Card>
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
