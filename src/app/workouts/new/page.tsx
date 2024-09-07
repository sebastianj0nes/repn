'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, Plus, Check, Camera, Smile, Meh, Frown } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Confetti from 'react-confetti'
import Link from 'next/link'
import { Database } from '@/lib/database.types'

interface Exercise {
  name: string;
  sets: { weight: string; reps: string }[];
}

interface Workout {
  muscleGroup: string;
  exercises: Exercise[];
  feeling: 'great' | 'okay' | 'bad';
}

export default function NewWorkoutPage() {
  const [workout, setWorkout] = useState<Workout>({ muscleGroup: '', exercises: [], feeling: 'okay' })
  const [currentExercise, setCurrentExercise] = useState<Exercise>({ name: '', sets: [{ weight: '', reps: '' }] })
  const [isFinished, setIsFinished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [session, setSession] = useState<any>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    fetchSession()
  }, [supabase])

  const handleMuscleGroupChange = (value: string) => {
    setWorkout(prev => ({ ...prev, muscleGroup: value }))
  }

  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise(prev => ({ ...prev, name: e.target.value }))
  }

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    setCurrentExercise(prev => {
      const newSets = [...prev.sets]
      newSets[index] = { ...newSets[index], [field]: value }
      return { ...prev, sets: newSets }
    })
  }

  const addSet = () => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, { weight: '', reps: '' }]
    }))
  }

  const saveExercise = () => {
    if (currentExercise.name && currentExercise.sets.some(set => set.weight && set.reps)) {
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, currentExercise]
      }))
      setCurrentExercise({ name: '', sets: [{ weight: '', reps: '' }] })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }

  const finishWorkout = async () => {
    if (!session?.user) {
      alert('You must be logged in to save a workout.')
      return
    }

    try {
      let image_url = null
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('workout-images')
          .upload(fileName, image)

        if (error) throw error
        image_url = data.path
      }

      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: session.user.id,
          date: new Date().toISOString(),
          muscle_group: workout.muscleGroup,
          feeling: workout.feeling,
          sotd: workout.exercises[0]?.sets[0] ? `${workout.exercises[0].sets[0].weight}x${workout.exercises[0].sets[0].reps} ${workout.exercises[0].name}` : '',
          image_url
        })
        .select()

      if (workoutError) throw workoutError

      const exercisesData = workout.exercises.map((exercise, index) => ({
        workout_id: workoutData[0].id,
        name: exercise.name,
        sets: JSON.stringify(exercise.sets),
        order: index + 1
      }))

      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesData)

      if (exercisesError) throw exercisesError

      setIsFinished(true)
    } catch (error) {
      console.error('Error submitting workout:', error)
      alert('Failed to log workout. Please try again.')
    }
  }

  const FeelingEmoji = ({ feeling }: { feeling: 'great' | 'okay' | 'bad' }) => {
    switch (feeling) {
      case 'great':
        return <Smile className="h-8 w-8 text-green-500" />
      case 'okay':
        return <Meh className="h-8 w-8 text-yellow-500" />
      case 'bad':
        return <Frown className="h-8 w-8 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] overflow-auto">
      <motion.h1 
        className="text-3xl font-bold text-primary mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        New Workout
      </motion.h1>
      {!isFinished ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="muscleGroup">Muscle Group</Label>
                <Select onValueChange={handleMuscleGroupChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chest">Chest</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                    <SelectItem value="legs">Legs</SelectItem>
                    <SelectItem value="shoulders">Shoulders</SelectItem>
                    <SelectItem value="arms">Arms</SelectItem>
                    <SelectItem value="core">Core</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>How&apos;s your workout going?</Label>
                <div className="flex justify-around">
                  {(['bad', 'okay', 'great'] as const).map((feeling) => (
                    <motion.button
                      key={feeling}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setWorkout(prev => ({ ...prev, feeling }))}
                      className={`p-2 rounded-full ${workout.feeling === feeling ? 'bg-primary' : 'bg-secondary'}`}
                    >
                      <FeelingEmoji feeling={feeling} />
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{currentExercise.name ? 'Current Exercise' : 'Add New Exercise'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Exercise name"
                value={currentExercise.name}
                onChange={handleExerciseNameChange}
              />
              <AnimatePresence>
                {currentExercise.sets.map((set, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex space-x-2"
                  >
                    <Input
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                      className="w-1/2"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex space-x-2">
                <Button onClick={addSet} variant="outline" className="w-1/2">
                  <Plus className="mr-2 h-4 w-4" /> Add Set
                </Button>
                <Button onClick={saveExercise} className="w-1/2">
                  <Check className="mr-2 h-4 w-4" /> Save Exercise
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - {exercise.sets.length} sets
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Workout Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </div>
                  <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" ref={fileInputRef} />
                </Label>
              </div>
              {image && <p className="mt-2 text-sm text-gray-500">{image.name}</p>}
            </CardContent>
          </Card>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={finishWorkout} className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
              <Dumbbell className="mr-2 h-4 w-4" /> Finish Workout
            </Button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full"
        >
          <Confetti />
          <h2 className="text-3xl font-bold text-primary mb-4">Workout Complete!</h2>
          <p className="text-xl text-center mb-8">Great job crushing your workout. Keep up the awesome work!</p>
          <Button asChild className="w-full max-w-md">
            <Link href="/progress">View Your Progress</Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}