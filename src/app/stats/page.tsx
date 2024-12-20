'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon, BarChart2Icon, DumbbellIcon, CalendarIcon, Loader2, InfoIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "@/components/ui/tooltip"
import { format, parseISO } from 'date-fns'
import { Gauge } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import BottomNav from '@/components/BottomNav'

type Workout = Database['public']['tables']['workouts']['Row']
type WeightData = {
  date: string
  weight: number
}

interface StatsData {
  workouts: Workout[]
  holy_trinity_stats: {
    bench: { total_reps: number; max_weight: number }
    squat: { total_reps: number; max_weight: number }
    deadlift: { total_reps: number; max_weight: number }
  }
  weight_data: WeightData[]
}

interface ExerciseWithSessions {
  id: string;
  name: string;
  muscle_group: string;
}

const groupByMonth = (data: any[]) => {
  const monthGroups = data.reduce((acc: { [key: string]: any[] }, item) => {
    const date = new Date(item.date)
    const month = format(date, 'yyyy-MM')
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(item)
    return acc
  }, {})

  return Object.entries(monthGroups).flatMap(([month, items], index) => {
    return items.map((item, itemIndex) => ({
      ...item,
      displayMonth: itemIndex === Math.floor(items.length / 2) ? 
        format(new Date(month + '-01'), 'MMMM') : 
        ''
    }))
  })
}

export default function StatsPage() {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [exerciseData, setExerciseData] = useState<any[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingExercise, setIsLoadingExercise] = useState(false)
  const [exercises, setExercises] = useState<ExerciseWithSessions[]>([])
  const [showTooltip, setShowTooltip] = useState(false)
  const [showWeightTooltip, setShowWeightTooltip] = useState(false)
  
  const supabase = createClientComponentClient<Database>()

  // Initial stats fetch
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase.rpc('get_user_stats', {
          user_id: user.id
        })
        
        if (error) throw error
        setStatsData(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [supabase])

  // Fetch specific exercise data when selected
  useEffect(() => {
    const fetchExerciseData = async () => {
      if (!selectedExercise) {
        setExerciseData([])
        return
      }

      setIsLoadingExercise(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      try {
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .select(`
            max_weight,
            workouts (date)
          `)
          .eq('name', selectedExercise)
          .eq('workouts.user_id', user.id)

        if (exerciseError) throw exerciseError

        const formattedData = exerciseData
          .map((exercise: any) => ({
            date: exercise.workouts.date,
            weight: exercise.max_weight,
            originalDate: exercise.workouts.date
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setExerciseData(groupByMonth(formattedData))
      } catch (error) {
        console.error('Error fetching exercise data:', error)
      } finally {
        setIsLoadingExercise(false)
      }
    }

    fetchExerciseData()
  }, [selectedExercise, supabase])

  // Fetch exercises for the dropdown
  useEffect(() => {
    const fetchExercises = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.rpc('get_exercises_with_multiple_sessions', {
        user_id: user.id
      })

      if (error) {
        console.error('Error fetching exercises:', error)
        return
      }

      setExercises(data || [])
    }

    fetchExercises()
  }, [supabase])

  const calculateLongestStreak = (workouts: Workout[]): number => {
    if (!workouts || workouts.length === 0) return 0

    // Sort workouts by date in descending order (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    let currentStreak = 1
    let longestStreak = 1
    let previousDate = new Date(sortedWorkouts[0].date)

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const currentDate = new Date(sortedWorkouts[i].date)
      
      // Calculate the difference in days
      const diffTime = previousDate.getTime() - currentDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day
        currentStreak++
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }
      } else {
        // Break in streak
        currentStreak = 1
      }

      previousDate = currentDate
    }

    return longestStreak
  }

  const groupExercisesByMuscle = (exercises: ExerciseWithSessions[]): Record<string, ExerciseWithSessions[]> => {
    return exercises.reduce((acc, exercise) => {
      if (!acc[exercise.muscle_group]) {
        acc[exercise.muscle_group] = []
      }
      acc[exercise.muscle_group].push(exercise)
      return acc
    }, {} as Record<string, ExerciseWithSessions[]>)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {isLoadingStats ? (
        <div className="flex justify-center items-center h-screen">
          <DumbbellIcon className="animate-spin w-12 h-12 text-primary" />
        </div>
      ) : (
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
                      <p className="text-2xl font-bold">{statsData?.workouts?.length || 0}</p>
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
                      <p className="text-2xl font-bold">{calculateLongestStreak(statsData?.workouts || [])} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Holy Trinity Section */}
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
                <Tooltip 
                  open={showTooltip} 
                  onOpenChange={setShowTooltip}
                >
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="p-0 h-auto w-auto hover:bg-transparent"
                      onClick={() => setShowTooltip(!showTooltip)}
                    >
                      <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="max-w-[200px] p-3"
                  >
                    <p className="text-sm">
                      The three main compound lifts in powerlifting: Squat, Bench Press and Deadlift.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { title: 'Squat', stats: statsData?.holy_trinity_stats.squat },
                { title: 'Bench', stats: statsData?.holy_trinity_stats.bench },
                { title: 'Deadlift', stats: statsData?.holy_trinity_stats.deadlift },
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
                        <div className="text-3xl font-bold">{lift.stats?.total_reps || 0}</div>
                        <p className="text-sm text-muted-foreground">Total Reps</p>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="text-2xl font-bold text-primary">{lift.stats?.max_weight || 0}</div>
                        <p className="text-sm text-muted-foreground">Max Weight (kg)</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Exercise Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pb-16 mt-16"
          >
            <div className="flex justify-center items-center gap-2 mb-8">
              <h2 className="text-2xl font-bold text-center text-primary pb-4 pt-3">
                Exercise Progress
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="p-0 h-auto w-auto hover:bg-transparent"
                    >
                      <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] p-3">
                    <p className="text-sm">
                      Shows progress for exercises you have logged in at least two separate workouts
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="w-full max-w-sm mx-auto mb-8">
              {exercises.length > 0 ? (
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
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No exercises with multiple sessions yet</p>
                  <p className="text-sm mt-2">
                    Log the same exercise in different workouts to track progress
                  </p>
                </div>
              )}
            </div>

            {selectedExercise && (
              <Card className="w-full max-w-[100vw] mb-8">
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    {isLoadingExercise ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-primary text-sm animate-pulse">
                          Loading exercise data...
                        </div>
                      </div>
                    ) : (
                      <LineChart data={exerciseData}>
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#9C8C9C" 
                          strokeWidth={2}
                          dot={{
                            stroke: '#9C8C9C',
                            strokeWidth: 2,
                            r: 3,
                            fill: 'hsl(var(--card))'
                          }}
                          activeDot={{
                            stroke: '#9C8C9C',
                            strokeWidth: 2,
                            r: 5,
                            fill: '#9C8C9C'
                          }}
                        />
                        <XAxis 
                          dataKey="displayMonth"
                          interval={0}
                          height={50}
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          angle={0}
                          textAnchor="middle"
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          tickFormatter={(value) => `${value}`}
                          tick={{ fontSize: 12 }}
                          width={30}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            padding: '8px'
                          }}
                          labelFormatter={(value, payload) => {
                            if (payload && payload[0]) {
                              const dataPoint = payload[0].payload;
                              return format(new Date(dataPoint.originalDate), 'MMMM d, yyyy');
                            }
                            return '';
                          }}
                          formatter={(value: number) => [`${value}kg`, 'Weight']}
                        />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Weight Tracking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 mb-24 -mx-4 sm:mx-0"
          >
            <div className="flex justify-center items-center gap-2 mb-4 px-4 sm:px-0">
              <h2 className="text-2xl font-bold text-center text-primary">
                Weight Progress
              </h2>
              <TooltipProvider>
                <Tooltip 
                  open={showWeightTooltip} 
                  onOpenChange={setShowWeightTooltip}
                >
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="p-0 h-auto w-auto hover:bg-transparent"
                      onClick={() => setShowWeightTooltip(!showWeightTooltip)}
                    >
                      <Gauge className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="max-w-[200px] p-3"
                  >
                    <p className="text-sm">
                      Track your weight progress over time
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Card className="w-full">
              <CardContent className="p-0 sm:p-4">
                {statsData?.weight_data && statsData.weight_data.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={statsData.weight_data}
                        margin={{
                          top: 20,
                          right: 5,
                          left: 0,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis 
                          dataKey="date"
                          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tick={{ fontSize: 12 }}
                          tickMargin={20}
                          interval={'preserveStartEnd'}
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          tickFormatter={(value) => `${value}`}
                          tick={{ fontSize: 12 }}
                          width={30}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            padding: '8px',
                            fontSize: '12px',
                            zIndex: 1000,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                          }}
                          wrapperStyle={{ zIndex: 1000 }}
                          cursor={{ strokeWidth: 1 }}
                          labelFormatter={(date: string) => format(parseISO(date), 'MMM d, yyyy')}
                          formatter={(value: number) => [`${value}kg`, 'Weight']}
                          isAnimationActive={false}
                          position={{ y: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#9C8C9C"
                          strokeWidth={2}
                          dot={{
                            stroke: '#9C8C9C',
                            strokeWidth: 2,
                            r: 3,
                            fill: 'hsl(var(--card))'
                          }}
                          activeDot={{
                            stroke: '#9C8C9C',
                            strokeWidth: 2,
                            r: 5,
                            fill: '#9C8C9C'
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
      )}
      <BottomNav />
    </div>
  )
}
