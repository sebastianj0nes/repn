import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Minus } from 'lucide-react'

interface ExerciseFormProps {
  exercises: { name: string; sets: { weight: string; reps: string }[] }[]
  setExercises: React.Dispatch<React.SetStateAction<{ name: string; sets: { weight: string; reps: string }[] }[]>>
}

export default function ExerciseForm({ exercises, setExercises }: ExerciseFormProps) {
  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }] }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets.push({ weight: '', reps: '' })
    setExercises(newExercises)
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
    setExercises(newExercises)
  }

  const handleExerciseChange = (exerciseIndex: number, field: keyof typeof exercises[number], value: string) => {
    const newExercises = [...exercises]
    if (field === 'name') {
      newExercises[exerciseIndex][field] = value
    } else if (field === 'sets') {
      // Handle sets separately if needed
      console.warn('Changing sets directly is not supported')
    }
    setExercises(newExercises)
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof typeof exercises[number]['sets'][number], value: string) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets[setIndex][field] = value
    setExercises(newExercises)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercises</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {exercises.map((exercise, exerciseIndex) => (
            <motion.div
              key={exerciseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 p-4 bg-gray-50 rounded-md"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor={`exercise-${exerciseIndex}`}>Exercise {exerciseIndex + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <Input
                id={`exercise-${exerciseIndex}`}
                value={exercise.name}
                onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                placeholder="Exercise name"
              />
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center space-x-2">
                  <Input
                    value={set.weight}
                    onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                    placeholder="Weight (kg)"
                    className="w-1/3"
                  />
                  <Input
                    value={set.reps}
                    onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                    placeholder="Reps"
                    className="w-1/3"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSet(exerciseIndex, setIndex)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSet(exerciseIndex)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Set
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          type="button"
          variant="outline"
          onClick={addExercise}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Exercise
        </Button>
      </CardContent>
    </Card>
  )
}