'use client'

import { useState, useRef, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Smile, Frown, Meh } from 'lucide-react'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { UserContext } from '../UserContext'

export default function ProgressPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [workoutDays, setWorkoutDays] = useState<string[]>([])
  const [workoutDetails, setWorkoutDetails] = useState<Record<string, any>>({})
  const { session } = useContext(UserContext)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!session?.user) return

      const { data: workouts, error } = await supabase
        .from('workouts')
        .select(`
          id,
          date,
          muscle_group,
          feeling,
          sotd,
          image_url,
          exercises (
            id,
            name,
            sets
          )
        `)
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching workouts:', error)
        return
      }

      const days = workouts.map(workout => workout.date.split('T')[0])
      setWorkoutDays(days)

      const details: Record<string, any> = {}
      for (const workout of workouts) {
        const dateKey = workout.date.split('T')[0]
        let imageUrl = null

        if (workout.image_url) {
          try {
            const { data, error } = await supabase
              .storage
              .from('users-workout-img')
              .createSignedUrl(workout.image_url, 60 * 60 * 24 * 7) // URL valid for 7 days

            if (error) {
              console.error('Error creating signed URL:', error)
            } else if (data) {
              imageUrl = data.signedUrl
            }
          } catch (error) {
            console.error('Error creating signed URL:', error)
          }
        }

        details[dateKey] = {
          muscleGroup: workout.muscle_group,
          feeling: workout.feeling,
          sotd: workout.sotd,
          exercises: workout.exercises.map((exercise: any) => ({
            name: exercise.name,
            sets: JSON.parse(exercise.sets)
          })),
          image: imageUrl
        }
      }
      console.log('Workout details:', details)
      setWorkoutDetails(details)
    };

    fetchWorkouts();
  }, [session.user, supabase]);

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

  const selectedDateString = selectedDate ? 
    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
    : undefined
  const workoutDetail = selectedDateString ? workoutDetails[selectedDateString] : null

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-xl text-muted-foreground">Please log in to view your progress</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pb-16">
      <div className="container mx-auto px-4 py-6 flex-grow flex flex-col overflow-hidden">
        <h1 className="text-3xl font-bold text-primary mb-6">Your Progress</h1>
        <div className="flex-grow flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 overflow-hidden">
          <motion.div 
            className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardContent className="p-1 md:p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                  modifiers={{ workout: workoutDays.map(day => new Date(day)) }}
                  modifiersStyles={{
                    workout: {
                      backgroundColor: '#4ade80',
                      color: 'white',
                      borderRadius: '50%',
                    }
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
          <div className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {workoutDetail ? (
                <motion.div
                  key={selectedDateString}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground">
                      <CardTitle className="text-xl font-semibold">
                        {selectedDate ? formatDate(selectedDate) : 'No date selected'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-2/3 space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Dumbbell className="h-6 w-6 text-secondary" />
                              <span className="text-lg font-medium text-primary">{workoutDetail.muscleGroup}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-primary">Feeling:</span>
                              {getEmojiForFeeling(workoutDetail.feeling)}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            <strong>Set of the day:</strong> {workoutDetail.sotd}
                          </div>
                          <div className="space-y-4">
                            {workoutDetail.exercises.map((exercise: { name: string; sets: any[] }, index: number) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-gray-50 p-4 rounded-md shadow"
                              >
                                <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {exercise.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="bg-white p-2 rounded border border-gray-200">
                                      <span className="font-medium">Set {setIndex + 1}:</span> {set.weight}kg x {set.reps}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div className="w-full md:w-1/3">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full h-64 md:h-full rounded-lg overflow-hidden"
                          >
                            <div className="relative w-full h-64 md:h-full">
                              {workoutDetail.image ? (
                                <Image
                                  src={workoutDetail.image}
                                  alt="Workout selfie"
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              ) : (
                                <Image
                                  src="/placeholder.svg"
                                  alt="Placeholder"
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <p className="text-lg text-muted-foreground">Select a date to view workout details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}