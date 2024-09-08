'use client'

import { useState, useRef, useContext } from 'react'
import { UserContext } from '@/app/UserContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarIcon, Dumbbell, Plus, Check, Camera, Upload, Smile, Meh, Frown, ChevronRight, Star } from 'lucide-react'
import { format, isFuture, startOfDay } from 'date-fns'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Confetti from 'react-confetti'
import Link from 'next/link'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image';

interface Set {
  weight: string;
  reps: string;
  isDropSet: boolean;
  isSetOfTheDay: boolean;
}

interface Exercise {
  name: string;
  sets: Set[];
}

interface Workout {
  date: Date;
  muscleGroups: string[];
  exercises: Exercise[];
  feeling: 'great' | 'okay' | 'bad';
}

export default function LogPastWorkoutPage() {
  const supabase = createClientComponentClient()
  const session  = useContext(UserContext)
  const [step, setStep] = useState(1)
  const [workout, setWorkout] = useState<Workout>({ date: new Date(), muscleGroups: [], exercises: [], feeling: 'okay' })
  const [currentExercise, setCurrentExercise] = useState<Exercise>({ name: '', sets: [{ weight: '', reps: '', isDropSet: false, isSetOfTheDay: false }] })
  const [isFinished, setIsFinished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setWorkout(prev => ({ ...prev, date: selectedDate }))
      setDate(selectedDate)
      setIsCalendarOpen(false)
    }
  }

  const isDateInFuture = (date: Date) => {
    return isFuture(startOfDay(date))
  }

  const handleMuscleGroupChange = (value: string) => {
    setWorkout(prev => {
      const muscleGroups = prev.muscleGroups.includes(value)
        ? prev.muscleGroups.filter(group => group !== value)
        : [...prev.muscleGroups, value]
      return { ...prev, muscleGroups }
    })
  }

  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise(prev => ({ ...prev, name: e.target.value }))
  }

  const handleSetChange = (index: number, field: keyof Set, value: string | boolean) => {
    setCurrentExercise(prev => {
      const newSets = [...prev.sets]
      newSets[index] = { ...newSets[index], [field]: value }
      if (field === 'isSetOfTheDay' && value === true) {
        newSets.forEach((set, i) => {
          if (i !== index) set.isSetOfTheDay = false
        })
      }
      return { ...prev, sets: newSets }
    })
  }

  const addSet = (isDropSet: boolean = false) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, { weight: '', reps: '', isDropSet, isSetOfTheDay: false }]
    }))
  }

  const saveExercise = () => {
    if (currentExercise.name && currentExercise.sets.some(set => set.weight && set.reps)) {
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, currentExercise]
      }))
      setCurrentExercise({ name: '', sets: [{ weight: '', reps: '', isDropSet: false, isSetOfTheDay: false }] })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const isWorkoutValid = () => {
    return (
      workout.date &&
      workout.muscleGroups.length > 0 &&
      workout.exercises.length > 0 &&
      workout.exercises.every(exercise => 
        exercise.name && exercise.sets.some(set => set.weight && set.reps)
      ) &&
      workout.feeling
    )
  }

  const finishWorkout = async () => {
    if (!isWorkoutValid()) {
      alert('Please fill in all required fields before logging the workout.')
      return
    }

    try {
      if (!session?.session?.user) throw new Error('No user logged in')
        

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

      const setOfTheDay = workout.exercises.flatMap(ex => ex.sets).find(set => set.isSetOfTheDay)
      const sotd = setOfTheDay ? `${setOfTheDay.weight}x${setOfTheDay.reps} ${workout.exercises.find(ex => ex.sets.includes(setOfTheDay))?.name}` : ''

      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: session.session.user.id,
          date: workout.date,
          muscle_group: workout.muscleGroups.join(', '),
          feeling: workout.feeling,
          sotd,
          image_url
        })
        .select()

      if (workoutError) throw workoutError

      const exercisesData = workout.exercises.flatMap((exercise, index) => 
        exercise.sets.map(set => ({
          workout_id: workoutData[0].id,
          name: exercise.name,
          sets: JSON.stringify([set]),
          order: index
        }))
      )

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                Past Workout Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="workoutDate">Workout Date</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      disabled={isDateInFuture}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="muscleGroups">Muscle Groups</Label>
                <Select onValueChange={handleMuscleGroupChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle groups" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].map((group) => (
                      <SelectItem key={group} value={group.toLowerCase()}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {workout.muscleGroups.map((group) => (
                    <Badge key={group} variant="secondary" className="text-sm">
                      {group}
                      <button
                        className="ml-1 text-xs"
                        onClick={() => handleMuscleGroupChange(group)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                disabled={workout.muscleGroups.length === 0}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Dumbbell className="mr-2 h-5 w-5 text-gray-500" />
                {currentExercise.name ? 'Current Exercise' : 'Add Past Exercise'}
              </CardTitle>
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
                    className="flex space-x-2 items-center"
                  >
                    <Input
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                      className="w-1/3"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`dropset-${index}`}
                        checked={set.isDropSet}
                        onCheckedChange={(checked) => handleSetChange(index, 'isDropSet', checked as boolean)}
                      />
                      <Label htmlFor={`dropset-${index}`}>Dropset</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`sotd-${index}`}
                        checked={set.isSetOfTheDay}
                        onCheckedChange={(checked) => handleSetChange(index, 'isSetOfTheDay', checked as boolean)}
                      />
                      <Label htmlFor={`sotd-${index}`}>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </Label>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex space-x-2">
                <Button onClick={() => addSet()} variant="outline" className="w-1/2">
                  <Plus className="mr-2 h-4 w-4" /> Add Set
                </Button>
                <Button onClick={() => addSet(true)} variant="outline" className="w-1/2">
                  <Plus className="mr-2 h-4 w-4" /> Add Dropset
                </Button>
              </div>
              <Button onClick={saveExercise} className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Check className="mr-2 h-4 w-4" /> Save Exercise
              </Button>
              {workout.exercises.length > 0 && (
                <Button onClick={() => setStep(3)} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                  Finish Exercises <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Dumbbell className="mr-2 h-5 w-5 text-gray-500" />
                Past Workout Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-100 rounded-lg">
                    <h3 className="font-bold">{exercise.name}</h3>
                    <ul className="list-disc pl-5 text-sm">
                      {exercise.sets.map((set, setIndex) => (
                        <li key={setIndex} className="flex items-center space-x-2">
                          <span>{set.weight}kg x {set.reps}</span>
                          {set.isDropSet && <span className="text-xs bg-blue-500 text-white px-1 rounded">Drop</span>}
                          {set.isSetOfTheDay && <Star className="h-4 w-4 text-yellow-500" />}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(4)} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Smile className="mr-2 h-5 w-5 text-gray-500" />
                How did your workout go?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-around">
                {(['bad', 'okay', 'great'] as const).map((feeling) => (
                  <motion.button
                    key={feeling}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWorkout(prev => ({ ...prev, feeling }))}
                    className={`p-2 rounded-full ${workout.feeling === feeling ? 'bg-gray-600' : 'bg-gray-200'}`}
                  >
                    <FeelingEmoji feeling={feeling} />
                  </motion.button>
                ))}
              </div>
              <Button onClick={() => setStep(5)} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Camera className="mr-2 h-5 w-5 text-gray-500" />
                Workout Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {imagePreview ? (
                  <div className="relative w-full h-64">
                    <Image src={imagePreview} alt="Workout preview" className="w-full h-full object-cover rounded-lg" width={500} height={300} />
                    <Button
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-4">
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                      </Button>
                      <Button onClick={handleTakePhoto} variant="outline">
                        <Camera className="mr-2 h-4 w-4" /> Take Photo
                      </Button>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={cameraInputRef}
                    />
                  </>
                )}
              </div>
              <Button 
                onClick={finishWorkout} 
                className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                disabled={!isWorkoutValid()}
              >
                <Dumbbell className="mr-2 h-4 w-4" /> Log Past Workout
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] overflow-auto">
      {!isFinished ? (
        <>
          <motion.h1 
            className="text-3xl font-bold text-gray-700 mb-6 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CalendarIcon className="mr-2 h-8 w-8 text-gray-500" />
            Log Past Workout
          </motion.h1>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full"
        >
          <Confetti />
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Workout Logged!</h2>
          <p className="text-xl text-center mb-8">Great job recording your past workout. Keep tracking your progress!</p>
          <Button asChild className="w-full max-w-md bg-gray-600 hover:bg-gray-700 text-white">
            <Link href="/progress">View Your Progress</Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}