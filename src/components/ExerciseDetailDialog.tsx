import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Plus, Info, X, CheckCircle2, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExerciseTier, getTierColor } from '@/lib/types/exercise'
import { motion } from "framer-motion"

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        max-w-md p-0 rounded-lg shadow-lg overflow-hidden border border-black/20
        data-[state=open]:animate-slideIn
        data-[state=closed]:animate-slideOut
        ${exercise.tier === 'A*' 
          ? 'bg-gradient-to-br from-yellow-400/90 via-yellow-200/90 to-yellow-400/90 border-2 border-yellow-500'
          : exercise.tier === 'A'
          ? 'bg-gradient-to-br from-green-400/90 via-green-200/90 to-green-400/90 border-2 border-green-500'
          : exercise.tier === 'B'
          ? 'bg-gradient-to-br from-blue-400/90 via-blue-200/90 to-blue-400/90 border-2 border-blue-500'
          : 'bg-white'
        }
      `}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Section */}
        <div className="p-6 pb-0">
          <DialogHeader className="mb-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <DialogTitle className="text-xl font-bold text-gray-900">
                {exercise.name}
              </DialogTitle>
              <div className="flex items-center justify-between mt-2">
                <div className="flex-1"></div>
                <p className="text-sm text-gray-600 flex-1">
                  {exercise.muscle_group}
                </p>
                <div className="flex-1 flex justify-end">
                  <Badge 
                    variant="outline" 
                    className={`
                      font-bold px-3 py-1
                      ${exercise.tier === 'A*' 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-transparent' 
                        : exercise.tier === 'A'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-transparent'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent'
                      }
                    `}
                  >
                    {exercise.tier} TIER
                  </Badge>
                </div>
              </div>
            </motion.div>
          </DialogHeader>

          {/* Image Section with border */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-48 w-full bg-white rounded-lg shadow-inner mb-6 border border-black/20"
          >
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
          </motion.div>
        </div>

        {/* Content Section */}
        <ScrollArea className="max-h-[40vh]">
          <div className="p-6 pt-0 space-y-4">
            {/* Overview Section with border */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-black/20"
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                {exercise.overview}
              </p>
            </motion.div>

            {/* Combined Tips Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 gap-4"
            >
              {/* Key Points with border */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-black/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-gray-900">Key Points</h3>
                </div>
                <div className="grid gap-2">
                  {exercise.keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (index * 0.1) }}
                      className="bg-gray-50/80 rounded-md p-3 text-sm text-gray-600 border border-black/10"
                    >
                      {point}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pro Tips with border */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-black/20">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-gray-900">Pro Tips</h3>
                </div>
                <div className="grid gap-2">
                  {exercise.proTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="bg-gray-50/80 rounded-md p-3 text-sm text-gray-600 border border-black/10"
                    >
                      {tip}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>

        {/* Footer Button Section with border-top */}
        <div className="p-6 pt-4 bg-white/80 backdrop-blur-sm border-t border-black/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={() => console.log('Add to My Exercises:', exercise.name)}
              className={`
                w-full font-semibold
                ${exercise.tier === 'A*' 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : exercise.tier === 'A'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to My Exercises
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 