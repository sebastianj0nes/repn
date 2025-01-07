import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Barbell, Brain, Timer } from "@phosphor-icons/react"
import Image from 'next/image'
import { getExerciseImage } from '@/lib/utils/exerciseImages'
import { ExerciseDetailDialog } from './ExerciseDetailDialog'
import { useState } from 'react'
import { ExerciseTier } from '@/lib/types/exercise'
import { getExerciseDetails } from '@/lib/data/exercises/index'

interface ExerciseCardProps {
  exercise: {
    id: string
    name: string
    muscle_group: string
    image_url: string
    exercise_type: 'weights' | 'bodyweight' | 'time'
  }
  stats?: {
    total_sessions: number
    max_weight: number
    total_volume: number
    last_performed: string
  }
}

export function ExerciseCard({ exercise, stats }: ExerciseCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const exerciseImage = getExerciseImage(exercise.name, exercise.muscle_group)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsDialogOpen(true)}
        className="cursor-pointer"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="relative h-48 w-full bg-white flex items-center justify-center">
              {(exerciseImage || exercise.image_url) ? (
                <Image
                  src={exerciseImage || exercise.image_url}
                  alt={exercise.name}
                  fill
                  className="object-contain p-2"
                  unoptimized={exerciseImage?.endsWith('.gif')}
                  priority={exerciseImage?.endsWith('.gif')}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Barbell className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <Badge 
                className="absolute top-2 right-2 z-10"
                variant={exercise.exercise_type === 'weights' ? 'default' : 
                        exercise.exercise_type === 'bodyweight' ? 'secondary' : 'outline'}
              >
                {exercise.exercise_type === 'weights' && <Barbell className="w-4 h-4 mr-1" />}
                {exercise.exercise_type === 'bodyweight' && <Brain className="w-4 h-4 mr-1" />}
                {exercise.exercise_type === 'time' && <Timer className="w-4 h-4 mr-1" />}
                {exercise.exercise_type}
              </Badge>
            </div>
            
            <div className="p-4 bg-gray-100 text-center">
              <h3 className="font-semibold text-lg mb-1">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground">{exercise.muscle_group}</p>
              {stats && (
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Sessions: {stats.total_sessions}</p>
                  {exercise.exercise_type === 'weights' && (
                    <>
                      <p>Max Weight: {stats.max_weight}kg</p>
                      <p>Total Volume: {stats.total_volume}kg</p>
                    </>
                  )}
                  <p>Last Done: {new Date(stats.last_performed).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ExerciseDetailDialog
        exercise={{
          ...exercise,
          ...getExerciseDetails(exercise.name),
          image_url: exerciseImage || exercise.image_url,
        }}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
} 