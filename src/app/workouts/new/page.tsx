'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dumbbell, Plus, Check, Camera, Upload, Smile, Meh, Frown, ChevronRight, Star } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Confetti from 'react-confetti'
import Link from 'next/link'
import { Database } from '@/lib/database.types'
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
  muscleGroups: string[];
  exercises: Exercise[];
  feeling: 'great' | 'okay' | 'bad';
}

export default function NewWorkoutPage() {
  const [step, setStep] = useState(1)
  const [workout, setWorkout] = useState<Workout>({ muscleGroups: [], exercises: [], feeling: 'okay' })
  const [currentExercise, setCurrentExercise] = useState<Exercise>({ name: '', sets: [{ weight: '', reps: '', isDropSet: false, isSetOfTheDay: false }] })
  const [isFinished, setIsFinished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [session, setSession] = useState<any>(null)
  const supabase = createClientComponentClient<Database>()
  const buttonControls = useAnimation()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    fetchSession()
  }, [supabase])

  useEffect(() => {
    buttonControls.start({
      x: [0, 2, 0, -2, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  }, [buttonControls])

  const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"]

  const toggleMuscleGroup = (group: string) => {
    setWorkout(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...prev.muscleGroups, group]
    }))
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

  const finishWorkout = async () => {
    if (!session?.user) {
      alert('You must be logged in to save a workout.')
      return
    }

    const supabase = createClientComponentClient<Database>()

    try {
      let image_url = null
      if (image) {
        try {
          const fileExt = image.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { data, error } = await supabase.storage
            .from('users-workout-img')
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: false
            })
        
          if (error) {
            console.error('Supabase storage error:', error)
            throw error
          }
          image_url = data.path
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          confirm('Image upload failed. The workout will be saved without an image.')
        }
      }

      const setOfTheDay = workout.exercises.flatMap(ex => ex.sets).find(set => set.isSetOfTheDay)
      const sotd = setOfTheDay ? `${setOfTheDay.weight}x${setOfTheDay.reps} ${workout.exercises.find(ex => ex.sets.includes(setOfTheDay))?.name}` : ''

      // Start a transaction
      const { data, error } = await supabase.rpc('create_full_workout', {
        p_user_id: session.user.id,
        p_date: new Date().toISOString().split('T')[0], // Get only the date part
        p_muscle_group: workout.muscleGroups.join(', '),
        p_feeling: workout.feeling,
        p_sotd: sotd,
        p_image_url: image_url,
        p_exercises: workout.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets.map(set => ({
            weight: parseFloat(set.weight),
            reps: parseInt(set.reps)
          }))
        }))
      })

      if (error) throw error

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
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Muscle Groups</Label>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map(group => (
                    <Button
                      key={group}
                      onClick={() => toggleMuscleGroup(group)}
                      variant={workout.muscleGroups.includes(group) ? "default" : "outline"}
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 2:
        return (
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
              <Button onClick={saveExercise} className="w-full bg-green-500 hover:bg-green-600">
                <Check className="mr-2 h-4 w-4" /> Save Exercise
              </Button>
              {workout.exercises.length > 0 && (
                <Button onClick={() => setStep(3)} className="w-full">
                  Finish Exercises <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="mb-2 p-2 bg-secondary rounded-lg">
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
              <Button onClick={() => setStep(4)} className="w-full">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>How did your workout go?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button onClick={() => setStep(5)} className="w-full">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Workout Photo</CardTitle>
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
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
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
              <Button onClick={finishWorkout} className="w-full mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
                <Dumbbell className="mr-2 h-4 w-4" /> Finish Workout
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
      <motion.h1 
        className="text-3xl font-bold text-primary mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        New Workout
      </motion.h1>
      {!isFinished ? (
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
          <motion.div animate={buttonControls}>
            <Button asChild className="w-full max-w-md">
              <Link href="/progress">View Your Progress</Link>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}