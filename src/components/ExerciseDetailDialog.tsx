import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Plus, Info, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExerciseTier, getTierColor } from '@/lib/types/exercise'

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
        max-w-md p-6 rounded-lg shadow-lg
        ${exercise.tier === 'S' 
          ? 'bg-gradient-to-br from-yellow-400 via-yellow-200 to-yellow-400 border-2 border-yellow-500'
          : exercise.tier === 'A'
          ? 'bg-gradient-to-br from-green-400 via-green-200 to-green-400 border-2 border-green-500'
          : exercise.tier === 'B'
          ? 'bg-gradient-to-br from-blue-400 via-blue-200 to-blue-400 border-2 border-blue-500'
          : 'bg-white'
        }
      `}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className={`
              text-xl font-bold
              ${exercise.tier === 'S' ? 'text-yellow-900' : ''}
            `}>
              {exercise.name}
            </DialogTitle>
            <Badge 
              variant="outline" 
              className={`
                font-bold px-3 py-1
                ${exercise.tier === 'S' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-transparent' 
                  : ''}
              `}
            >
              {exercise.tier} TIER
            </Badge>
          </div>
          <p className={`
            text-sm mt-1
            ${exercise.tier === 'S' ? 'text-yellow-800' : 'text-muted-foreground'}
          `}>
            {exercise.muscle_group}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className={`
            relative h-48 w-full flex items-center justify-center mb-6 rounded-lg border
            ${exercise.tier === 'S' ? 'bg-gradient-to-b from-white/90 to-white/80' : 'bg-white'}
          `}>
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

          <div className="space-y-6">
            {['Overview', 'Key Points', 'Pro Tips'].map((section) => (
              <div key={section} className={`
                p-4 rounded-lg
                ${exercise.tier === 'S' 
                  ? 'bg-white/80 backdrop-blur-sm text-yellow-900' 
                  : exercise.tier === 'A'
                  ? 'bg-white/80 backdrop-blur-sm text-green-900'
                  : exercise.tier === 'B'
                  ? 'bg-white/80 backdrop-blur-sm text-blue-900'
                  : 'bg-gray-100'
                }
              `}>
                <h3 className="font-semibold text-lg mb-3">{section}</h3>
                {section === 'Overview' && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exercise.overview}
                  </p>
                )}
                {section === 'Key Points' && (
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-2">
                    {exercise.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
                {section === 'Pro Tips' && (
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-2">
                    {exercise.proTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button 
          onClick={() => console.log('Add to My Exercises:', exercise.name)}
          className={`
            w-full mt-6
            ${exercise.tier === 'S' 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
              : ''}
          `}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to My Exercises
        </Button>
      </DialogContent>
    </Dialog>
  )
} 