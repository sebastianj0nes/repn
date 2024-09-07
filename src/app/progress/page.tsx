'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Smile, Frown, Meh } from 'lucide-react'
import Image from 'next/image'

// Mock data for demonstration
const workoutDays = ['2024-06-01', '2024-06-03', '2024-06-05', '2024-06-07', '2024-06-10']
const workoutDetails = {
  '2024-06-01': { 
    muscleGroup: 'Chest', 
    feeling: 'good', 
    sotd: '3x12 Bench Press',
    exercises: [
      { name: 'Bench Press', sets: [{ weight: 80, reps: 12 }, { weight: 85, reps: 10 }, { weight: 90, reps: 8 }] },
      { name: 'Incline Dumbbell Press', sets: [{ weight: 30, reps: 12 }, { weight: 32.5, reps: 10 }, { weight: 35, reps: 8 }] },
      { name: 'Cable Flyes', sets: [{ weight: 15, reps: 15 }, { weight: 17.5, reps: 12 }, { weight: 20, reps: 10 }] },
      { name: 'Pushups', sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 18 }, { weight: 0, reps: 15 }] }
    ],
    image: '/placeholder.svg'
  },
  '2024-06-03': { 
    muscleGroup: 'Legs', 
    feeling: 'great', 
    sotd: '4x8 Squats',
    exercises: [
      { name: 'Squats', sets: [{ weight: 100, reps: 8 }, { weight: 110, reps: 8 }, { weight: 120, reps: 8 }, { weight: 130, reps: 6 }] },
      { name: 'Leg Press', sets: [{ weight: 150, reps: 12 }, { weight: 170, reps: 10 }, { weight: 190, reps: 8 }] },
      { name: 'Romanian Deadlifts', sets: [{ weight: 80, reps: 10 }, { weight: 90, reps: 10 }, { weight: 100, reps: 8 }] },
      { name: 'Calf Raises', sets: [{ weight: 100, reps: 15 }, { weight: 110, reps: 12 }, { weight: 120, reps: 10 }] }
    ],
    image: '/placeholder.svg'
  },
  '2024-06-05': { 
    muscleGroup: 'Back', 
    feeling: 'okay', 
    sotd: '3x10 Deadlifts',
    exercises: [
      { name: 'Deadlifts', sets: [{ weight: 120, reps: 10 }, { weight: 130, reps: 10 }, { weight: 140, reps: 8 }] },
      { name: 'Pull-ups', sets: [{ weight: 0, reps: 12 }, { weight: 0, reps: 10 }, { weight: 0, reps: 8 }] },
      { name: 'Barbell Rows', sets: [{ weight: 70, reps: 12 }, { weight: 80, reps: 10 }, { weight: 90, reps: 8 }] },
      { name: 'Lat Pulldowns', sets: [{ weight: 60, reps: 12 }, { weight: 70, reps: 10 }, { weight: 80, reps: 8 }] }
    ],
    image: '/placeholder.svg'
  },
  '2024-06-07': { 
    muscleGroup: 'Arms', 
    feeling: 'tired', 
    sotd: '3x15 Bicep Curls',
    exercises: [
      { name: 'Bicep Curls', sets: [{ weight: 15, reps: 15 }, { weight: 17.5, reps: 12 }, { weight: 20, reps: 10 }] },
      { name: 'Tricep Pushdowns', sets: [{ weight: 25, reps: 15 }, { weight: 30, reps: 12 }, { weight: 35, reps: 10 }] },
      { name: 'Hammer Curls', sets: [{ weight: 12.5, reps: 12 }, { weight: 15, reps: 10 }, { weight: 17.5, reps: 8 }] },
      { name: 'Skull Crushers', sets: [{ weight: 30, reps: 12 }, { weight: 35, reps: 10 }, { weight: 40, reps: 8 }] }
    ],
    image: '/placeholder.svg'
  },
  '2024-06-10': { 
    muscleGroup: 'Shoulders', 
    feeling: 'pumped', 
    sotd: '4x12 Shoulder Press',
    exercises: [
      { name: 'Shoulder Press', sets: [{ weight: 50, reps: 12 }, { weight: 55, reps: 10 }, { weight: 60, reps: 8 }, { weight: 65, reps: 6 }] },
      { name: 'Lateral Raises', sets: [{ weight: 10, reps: 15 }, { weight: 12.5, reps: 12 }, { weight: 15, reps: 10 }] },
      { name: 'Front Raises', sets: [{ weight: 10, reps: 12 }, { weight: 12.5, reps: 10 }, { weight: 15, reps: 8 }] },
      { name: 'Reverse Flyes', sets: [{ weight: 7.5, reps: 15 }, { weight: 10, reps: 12 }, { weight: 12.5, reps: 10 }] }
    ],
    image: '/placeholder.svg'
  },
}

export default function ProgressPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const detailsRef = useRef<HTMLDivElement>(null)

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
  const workoutDetail = selectedDateString ? workoutDetails[selectedDateString as keyof typeof workoutDetails] : null

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
                            {workoutDetail.exercises.map((exercise, index) => (
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
                            <Image
                              src={workoutDetail.image}
                              alt="Workout selfie"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
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