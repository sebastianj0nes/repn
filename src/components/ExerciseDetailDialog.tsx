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
      <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-lg">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{exercise.name}</DialogTitle>
            <Badge 
              variant="outline" 
              className="font-bold px-3 py-1"
              style={{
                backgroundColor: getTierColor(exercise.tier),
                color: 'white',
                borderColor: 'transparent'
              }}
            >
              Tier {exercise.tier}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{exercise.muscle_group}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="relative h-48 w-full bg-white flex items-center justify-center mb-6 rounded-lg border">
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
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exercise.overview}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Key Points</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-2">
                {exercise.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-2">
                {exercise.proTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>

        <Button 
          onClick={() => console.log('Add to My Exercises:', exercise.name)}
          className="w-full mt-6"
          variant="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to My Exercises
        </Button>
      </DialogContent>
    </Dialog>
  )
} 