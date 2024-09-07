'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Dumbbell, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import ExerciseForm from '@/components/ExerciseForm'
import { supabase } from '@/lib/supabase'

export default function LogPastWorkoutPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [muscleGroup, setMuscleGroup] = useState('')
  const [feeling, setFeeling] = useState('')
  const [sotd, setSotd] = useState('')
  const [exercises, setExercises] = useState([{ name: '', sets: [{ weight: '', reps: '' }] }])
  const [image, setImage] = useState<File | null>(null)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate <= new Date()) {
      setDate(selectedDate)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

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

      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          date: format(date, 'yyyy-MM-dd'),
          muscle_group: muscleGroup,
          feeling,
          sotd,
          image_url
        })
        .select()

      if (workoutError) throw workoutError

      const exercisesData = exercises.map((exercise, index) => ({
        workout_id: workout[0].id,
        name: exercise.name,
        sets: JSON.stringify(exercise.sets),
        order: index
      }))

      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesData)

      if (exercisesError) throw exercisesError

      alert('Workout logged successfully!')
      // Reset form state here
    } catch (error) {
      console.error('Error subm itting workout:', error)
      alert('Failed to log workout. Please try again.')
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
        Log Past Workout
      </motion.h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="muscleGroup">Muscle Group</Label>
              <Select onValueChange={setMuscleGroup}>
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
              <Label htmlFor="feeling">How did you feel?</Label>
              <Select onValueChange={setFeeling}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feeling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">Great</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="okay">Okay</SelectItem>
                  <SelectItem value="tired">Tired</SelectItem>
                  <SelectItem value="exhausted">Exhausted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="sotd">Set of the Day</Label>
              <Input id="sotd" value={sotd} onChange={(e) => setSotd(e.target.value)} placeholder="e.g., 3x12 Bench Press" />
            </div>
          </CardContent>
        </Card>

        <ExerciseForm exercises={exercises} setExercises={setExercises} />

        <Card>
          <CardHeader>
            <CardTitle>Upload Workout Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </Label>
            </div>
            {image && <p className="mt-2 text-sm text-gray-500">{image.name}</p>}
          </CardContent>
        </Card>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button type="submit" className="w-full">
            <Dumbbell className="mr-2 h-4 w-4" /> Log Workout
          </Button>
        </motion.div>
      </form>
    </div>
  )
}