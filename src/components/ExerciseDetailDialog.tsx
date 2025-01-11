import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Plus, Info, X, CheckCircle2, Lightbulb, History, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExerciseTier, getTierColor } from '@/lib/types/exercise'
import { motion, AnimatePresence } from "framer-motion"
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useExerciseHistory } from '@/lib/hooks/useExerciseHistory'

interface ExerciseDetailDialogProps {
  exercise: {
    id: string
    name: string
    muscle_group: string
    image_url: string
    exercise_type: 'weights' | 'bodyweight' | 'time'
    tier: ExerciseTier
    overview: string
    keyPoints: string[]
    proTips: string[]
  }
  isOpen: boolean
  onClose: () => void
}



export function ExerciseDetailDialog({ exercise, isOpen, onClose }: ExerciseDetailDialogProps) {
  console.log('Exercise prop:', exercise) // Debug exercise prop
  console.log('Exercise ID:', exercise.id) // Debug specific ID
  
  const { data: history, isLoading } = useExerciseHistory(exercise, isOpen)
  
  console.log('Query Result:', { history, isLoading }) // Debug query result

  const getTierStyles = () => {
    switch(exercise.tier) {
      case 'A*':
        return 'from-yellow-400 via-yellow-300 to-yellow-400 border-yellow-600'
      case 'A':
        return 'from-green-400 via-green-300 to-green-400 border-green-600'
      default:
        return 'from-blue-400 via-blue-300 to-blue-400 border-blue-600'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 rounded-xl shadow-lg overflow-hidden max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{exercise.name} Exercise Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[90vh]">
          {/* Main Card Container */}
          <div className={`
            w-full h-full flex flex-col
            bg-gradient-to-br ${getTierStyles()}
            p-4 space-y-4
          `}>
            {/* Header Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">{exercise.name}</h2>
                <button 
                  onClick={onClose}
                  className="rounded-full bg-black/20 p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-black/70">{exercise.muscle_group}</p>
                <Badge className={`
                  font-bold px-3 py-1 text-white border-2 border-black
                  bg-black/20 backdrop-blur-sm
                `}>
                  {exercise.tier} TIER
                </Badge>
              </div>
            </div>

            {/* Exercise Image Card */}
            <div className="relative h-48 w-full bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {exercise.image_url ? (
                <Image
                  src={exercise.image_url}
                  alt={exercise.name}
                  fill
                  className="object-contain p-2"
                  unoptimized={exercise.image_url?.endsWith('.gif')}
                  priority={exercise.image_url?.endsWith('.gif')}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Info className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger 
                    value="overview"
                    className="hover:bg-black/10 transition-all duration-200"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className="hover:bg-black/10 transition-all duration-200"
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  {/* Overview Section */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2 text-black">Overview</h3>
                    <p className="text-sm text-gray-600">{exercise.overview}</p>
                  </div>

                  {/* Key Points Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-lg text-black">Key Points</h3>
                    </div>
                    <ul className="space-y-2">
                      {exercise.keyPoints.map((point, index) => (
                        <li 
                          key={`point-${index}`}
                          className="text-sm text-gray-600 pl-4 border-l-2 border-primary"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tips Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-lg text-black">Pro Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {exercise.proTips.map((tip, index) => (
                        <li 
                          key={`tip-${index}`}
                          className="text-sm text-gray-600 pl-4 border-l-2 border-primary"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin">🏋️‍♂️</div>
                    </div>
                  ) : history && history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((session) => (
                        <div 
                          key={session.id}
                          className="bg-gray-50 rounded-lg p-4 border"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {new Date(session.workout_date).toLocaleDateString()}
                              </span>
                            </div>
                            {session.workout_feeling && (
                              <Badge variant="outline" className="text-xs">
                                Feeling: {session.workout_feeling}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {session.sets.map((set, index) => (
                              <div 
                                key={`${session.id}-set-${index}`}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span className="font-medium text-primary min-w-[3rem]">
                                  Set {set.set_number}:
                                </span>
                                <span>
                                  {exercise.exercise_type === 'weights' && (
                                    <>
                                      {set.weight}kg × {set.reps}
                                      {set.is_dropset && set.dropset_weight && set.dropset_reps && (
                                        <span className="text-gray-500 ml-2">
                                          → {set.dropset_weight}kg × {set.dropset_reps}
                                        </span>
                                      )}
                                    </>
                                  )}
                                  {exercise.exercise_type === 'bodyweight' && (
                                    <>{set.reps} reps</>
                                  )}
                                  {exercise.exercise_type === 'time' && (
                                    <>{set.duration}s</>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No exercise history yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => console.log('Add to My Exercises:', exercise.name)}
              className="w-full font-bold text-white border-2 border-black bg-black hover:bg-black/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to My Exercises
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 