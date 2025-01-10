import React from 'react';
import { forwardRef } from 'react';
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
import { useFilter } from '@/contexts/FilterContext';

interface ExerciseCardProps {
  exercise: {
    id: string
    name: string
    muscle_group: string
    image_url: string
    exercise_type: 'weights' | 'bodyweight' | 'time'
    tier: ExerciseTier
  }
  stats?: {
    total_sessions: number
    max_weight: number
    total_volume: number
    last_performed: string
  }
}

export const ExerciseCard = forwardRef<HTMLDivElement, ExerciseCardProps>(
  ({ exercise, stats }, ref) => {
    const { isFilterOpen } = useFilter();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const exerciseImage = getExerciseImage(exercise.name, exercise.muscle_group)

    const handleClick = (e: React.MouseEvent) => {
      if (isFilterOpen) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      setIsDialogOpen(true)
    };

    return (
      <div ref={ref} className="cursor-pointer">
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          className="cursor-pointer"
        >
          <Card 
            className={`
              overflow-hidden transition-all duration-300 hover:scale-105 h-[300px] flex flex-col
              ${exercise.tier === 'A*' 
                ? 'bg-gradient-to-br from-[#FFD700] via-[#FFF6A3] to-[#FFD700] relative animate-border-flow' 
                : exercise.tier === 'A'
                ? 'bg-gradient-to-br from-[#4ade80] via-[#86efac] to-[#4ade80] relative' 
                : exercise.tier === 'B'
                ? 'bg-gradient-to-br from-[#60a5fa] via-[#93c5fd] to-[#60a5fa] relative'
                : 'bg-card'
              }
            `}
          >
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative h-48 w-full flex items-center justify-center bg-white">
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
                {exercise.tier === 'A*' && (
                  <Badge 
                    className="absolute bottom-2 left-2 z-10 font-bold"
                    style={{
                      background: 'linear-gradient(45deg, #FFD700, #FFB700)',
                      border: '1px solid #FFB700',
                      color: '#000',
                      textShadow: '0 1px 1px rgba(255,255,255,0.5)'
                    }}
                  >
                    A* TIER
                  </Badge>
                )}
                {exercise.tier === 'A' && (
                  <Badge 
                    className="absolute bottom-2 left-2 z-10 font-bold"
                    style={{
                      background: 'linear-gradient(45deg, #4ade80, #22c55e)',
                      border: '1px solid #22c55e',
                      color: '#fff',
                      textShadow: '0 1px 1px rgba(0,0,0,0.2)'
                    }}
                  >
                    A TIER
                  </Badge>
                )}
                {exercise.tier === 'B' && (
                  <Badge 
                    className="absolute bottom-2 left-2 z-10 font-bold"
                    style={{
                      background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
                      border: '1px solid #3b82f6',
                      color: '#fff',
                      textShadow: '0 1px 1px rgba(0,0,0,0.2)'
                    }}
                  >
                    B TIER
                  </Badge>
                )}
              </div>
              
              <div className={`
                p-4 text-center flex-1 flex flex-col justify-between
                ${exercise.tier === 'A*' 
                  ? 'bg-gradient-to-b from-white/90 to-white/80 text-yellow-900' 
                  : exercise.tier === 'A'
                  ? 'bg-gradient-to-b from-white/90 to-white/80 text-green-900'
                  : exercise.tier === 'B'
                  ? 'bg-gradient-to-b from-white/90 to-white/80 text-blue-900'
                  : 'bg-gray-100'
                }
              `}>
                <div>
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  <p className={`text-sm -mt-0.5 ${
                    exercise.tier === 'A' 
                      ? 'text-green-800/80' 
                      : exercise.tier === 'B'
                      ? 'text-blue-800/80'
                      : 'text-muted-foreground'
                  }`}>
                    {exercise.muscle_group}
                  </p>
                </div>
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
      </div>
    )
  }
)

ExerciseCard.displayName = 'ExerciseCard'; 