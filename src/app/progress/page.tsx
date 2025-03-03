'use client'

import { useState, useRef, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Smile, Frown, Meh, Gauge, ImageIcon, Star, Scale, Target, Timer, Trophy, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { UserContext } from '../UserContext'
import Link from 'next/link'
import { ImageHandler } from '@/lib/utils/imageHandler'
import { format } from 'date-fns'
import {
  backExercises,
  chestExercises,
  shoulderExercises,
  bicepExercises,
  tricepExercises,
  coreExercises,
  legExercises
} from '@/lib/utils/exerciseImages'
import { InsightsPanel } from '@/components/workout/InsightsPanel'



export default function ProgressPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [workoutDays, setWorkoutDays] = useState<string[]>([])
  const [workoutDetails, setWorkoutDetails] = useState<Record<string, any>>({})
  const [expandedExercises, setExpandedExercises] = useState<boolean[]>([])
  const { session } = useContext(UserContext)
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 30
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date())

  const workoutDetail = selectedDate ? workoutDetails[selectedDate.toISOString().split('T')[0]] : null

  useEffect(() => {
    if (workoutDetail?.exercises) {
      setExpandedExercises(new Array(workoutDetail.exercises.length).fill(false))
    }
  }, [workoutDetail])

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!session?.user) return;
      
      setWorkoutDays([]);
      setIsLoading(true);

      try {
        const startOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
        const endOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);

        const { data, error } = await supabase
          .from('workouts')
          .select(`
            *,
            exercises (
              *,
              exercise_sets (*)
            )
          `)
          .eq('user_id', session.user.id)
          .gte('date', startOfMonth.toISOString())
          .lte('date', endOfMonth.toISOString())
          .order('date', { ascending: false });

        if (error) throw error;

        const days = data.map(workout => workout.date.split('T')[0]);
        setWorkoutDays(days);

        const details: Record<string, any> = {};
        for (const workout of data) {
          const dateKey = workout.date.split('T')[0];
          
          // Get signed URL if image exists
          let imageUrl = null;
          if (workout.image_url) {
            try {
              const signedUrl = await ImageHandler.getSignedUrl(supabase, workout.image_url);
              if (signedUrl) {
                imageUrl = signedUrl;
              }
            } catch (error) {
              console.error('Error getting signed URL:', error);
            }
          }

          details[dateKey] = {
            muscleGroup: workout.muscle_group,
            feeling: workout.feeling,
            sotd: workout.sotd,
            userWeight: workout.user_weight,
            exercises: workout.exercises.map((exercise: any) => ({
              name: exercise.name,
              sets: Array.isArray(exercise.exercise_sets) 
                ? exercise.exercise_sets 
                : (typeof exercise.exercise_sets === 'string' 
                  ? JSON.parse(exercise.exercise_sets) 
                  : [])
            })),
            image: imageUrl // Set the signed URL here
          };
        }

        setWorkoutDetails(details);
        
        if (days.length > 0 && isInitialLoad) {
          setSelectedDate(new Date(days[0]));
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts()
  }, [session?.user, supabase, visibleMonth])

  // Add this effect to handle image loading when a date is selected
  useEffect(() => {
    const loadSelectedWorkoutImage = async () => {
      if (selectedDate && workoutDetails) {
        const dateKey = selectedDate.toISOString().split('T')[0]
        const workout = workoutDetails[dateKey]
        
        if (workout && workout.image_url) {
          const signedUrl = await ImageHandler.getSignedUrl(supabase, workout.image_url)
          if (signedUrl) {
            setWorkoutDetails(prev => ({
              ...prev,
              [dateKey]: {
                ...prev[dateKey],
                image: signedUrl
              }
            }))
          }
        }
      }
    }

    loadSelectedWorkoutImage()
  }, [selectedDate, workoutDetails, supabase])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getEmojiForFeeling = (feeling: string) => {
    const emojiMap = {
      great: <Smile className="h-10 w-10 text-green-500" />,
      good: <Smile className="h-10 w-10 text-green-500" />,
      pumped: <Smile className="h-10 w-10 text-green-500" />,
      okay: <Meh className="h-10 w-10 text-yellow-500" />,
      tired: <Frown className="h-10 w-10 text-red-500" />,
    }
    return emojiMap[feeling as keyof typeof emojiMap] || <Meh className="h-10 w-10 text-secondary" />
  }

  const formatSotd = (sotd: string) => {
    if (!sotd) return 'None recorded';
    
    // Split the sotd string which is typically in format "Exercise Name: weight x reps" or "Exercise Name: reps reps"
    const [exerciseName, details] = sotd.split(':').map(s => s.trim());
    
    if (!details) return sotd; // Return original if not in expected format
    
    // Check if the details include 'x' which indicates weight and reps format
    if (details.includes('x')) {
      return sotd; // Return original format for weight exercises
    } else if (details.includes('reps')) {
      // For bodyweight exercises, reformat to "number Reps of Exercise Name"
      const reps = details.split(' ')[0]; // Get the number of reps
      return `${reps} reps of ${exerciseName}`;
    } else {
      // For time exercises or other formats, return as is
      return sotd;
    }
  }

  const getExerciseGifPath = (exerciseName: string): string | undefined => {
    const allExercises = {
      ...backExercises,
      ...chestExercises,
      ...shoulderExercises,
      ...bicepExercises,
      ...tricepExercises,
      ...coreExercises,
      ...legExercises
    };
    
    return allExercises[exerciseName as keyof typeof allExercises];
  };

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-xl text-muted-foreground">Please log in to view your progress</p>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto space-y-8 pb-20">
      {/* Move header to top with proper spacing */}
      <div className="pt-6 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your Progress</h1>
      </div>

      <div className="px-4 space-y-8">
        {/* Calendar Section - More prominent and clean */}
        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-2xl">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full p-3"
              modifiers={{ 
                workout: workoutDays.map(day => new Date(day))
              }}
              modifiersStyles={{
                workout: {
                  backgroundColor: '#22c55e',
                  color: 'white',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  transform: 'scale(0.9)'
                }
              }}
              onMonthChange={setVisibleMonth}
            />
          </CardContent>
        </Card>

        {/* Insights Panel - Cleaner integration */}
        <div className="space-y-1">
          <h2 className="text-lg font-medium px-1">Insights</h2>
          <InsightsPanel />
        </div>

        {/* Workout Details Section - Enhanced visual hierarchy */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-32 flex items-center justify-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <Dumbbell className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading workout data...</p>
              </div>
            </motion.div>
          ) : workoutDetail ? (
            <motion.div
              key={selectedDate?.toISOString() || 'no-selected-date'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-medium px-1">Workout Details</h2>
              <Card className="border-none shadow-lg overflow-hidden rounded-2xl">
                {/* Image Section - Full Width at Top */}
                <div className="w-full">
                  {workoutDetail.image ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative aspect-[4/3] w-full flex items-center justify-center bg-background"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={workoutDetail.image}
                          alt="Workout progress"
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="aspect-[4/3] w-full flex items-center justify-center bg-background">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No progress photo</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Workout Details Section */}
                <div className="p-4">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-6 pb-3 border-b">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Target className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-bold text-primary">
                        {format(selectedDate || new Date(), 'dd MMM yyyy')}
                      </h2>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm text-muted-foreground">Feeling:</span>
                      {getEmojiForFeeling(workoutDetail.feeling)}
                    </motion.div>
                  </div>

                  {/* Quick Stats Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {/* Muscle Groups */}
                      <div className="bg-primary/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Dumbbell className="h-4 w-4 text-primary" />
                          <h3 className="text-sm font-medium text-primary">Muscle Groups</h3>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {workoutDetail.muscleGroup.split(',').map((muscle: string, index: number) => (
                            <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {muscle.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bodyweight if exists */}
                      {workoutDetail.userWeight && (
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Scale className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-medium text-primary">Bodyweight</h3>
                          </div>
                          <p className="text-lg font-bold text-primary">{workoutDetail.userWeight} kg</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted-foreground/20"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-2 text-sm text-muted-foreground">Workout Details</span>
                    </div>
                  </div>

                  {/* SOTD and Exercises Section */}
                  <div className="space-y-6">
                    {/* SOTD Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-secondary/10 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <h3 className="font-medium text-secondary">Set of the Day</h3>
                      </div>
                      <p className="text-lg font-semibold">{formatSotd(workoutDetail.sotd)}</p>
                    </motion.div>

                    {/* Exercises Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-primary">Exercises</h3>
                      </div>
                      {workoutDetail.exercises.map((exercise: { name: string; sets: any[] }, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-muted/50 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              const newExpandedStates = [...expandedExercises]
                              newExpandedStates[index] = !newExpandedStates[index]
                              setExpandedExercises(newExpandedStates)
                            }}
                            className="w-full p-4 bg-primary/5"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border">
                                <Image
                                  src={getExerciseGifPath(exercise.name) || '/exercises/default.gif'}
                                  alt={exercise.name}
                                  fill
                                  className="object-cover"
                                  unoptimized={true}
                                />
                              </div>
                              <div className="flex-1 text-left">
                                <h4 className="font-medium text-lg">{exercise.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                                </p>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedExercises[index] ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedExercises[index] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {exercise.sets.map((set: any, setIndex: number) => (
                                    <motion.div
                                      key={setIndex}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.05 * setIndex }}
                                      className="bg-background rounded-md p-3 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">Set {setIndex + 1}</span>
                                        {set.is_dropset && (
                                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                            Drop Set
                                          </span>
                                        )}
                                      </div>
                                      <div className="font-medium">
                                        {set.duration ? (
                                          <div className="flex items-center gap-1">
                                            <Timer className="h-3 w-3 text-primary" />
                                            <span>{set.duration}s</span>
                                          </div>
                                        ) : (
                                          <span>
                                            {set.weight && set.reps ? (
                                              `${set.weight}kg × ${set.reps}`
                                            ) : set.reps ? (
                                              `${set.reps} reps`
                                            ) : 'N/A'}
                                          </span>
                                        )}
                                      </div>
                                      {set.is_dropset && (
                                        <div className="mt-1 text-sm text-primary">
                                          → {set.dropset_weight}kg × {set.dropset_reps}
                                        </div>
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="no-workout-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-32 flex items-center justify-center"
            >
              <p className="text-base text-muted-foreground">No workout found for this date</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
