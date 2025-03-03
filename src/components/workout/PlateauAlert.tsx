'use client'

import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react'
import { PlateauRecommendation, PlateauStatus } from '@/lib/utils/workoutAnalysis'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, Target, BarChart3, ArrowLeftRight } from 'lucide-react'
import Image from 'next/image'
import { ProgressChart } from '@/components/ProgressChart'

interface PlateauAlertProps {
  status: {
    severity: 'critical' | 'concern'
    duration: number
    message: string
    recommendation: string
    allRecommendations: PlateauRecommendation
  }
  exerciseName: string
  exerciseGif?: string
  muscleGroup: string
  className?: string
  priority: 'high' | 'medium' | 'low'
  exerciseData: {
    history: Array<{
      date: string
      weight: number
      volume: number
    }>
    maxWeight: number
    volumeProgress: number
  }
}

export function PlateauAlert({ 
  status, 
  exerciseName, 
  exerciseGif, 
  muscleGroup,
  className,
  priority,
  exerciseData 
}: PlateauAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setShowGraph(true), 100)
      return () => clearTimeout(timer)
    }
    setShowGraph(false)
  }, [isExpanded])

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          container: 'bg-red-50 border-2 border-red-200',
          badge: 'border-red-200 bg-red-100 text-red-700',
          icon: 'text-red-600'
        }
      case 'medium':
        return {
          container: 'bg-amber-50 border border-amber-200',
          badge: 'border-amber-200 bg-amber-100 text-amber-700',
          icon: 'text-amber-600'
        }
      case 'low':
        return {
          container: 'bg-blue-50 border border-blue-200',
          badge: 'border-blue-200 bg-blue-100 text-blue-700',
          icon: 'text-blue-600'
        }
      default:
        return {
          container: 'bg-gray-50 border border-gray-200',
          badge: 'border-gray-200 bg-gray-100 text-gray-700',
          icon: 'text-gray-600'
        }
    }
  }

  const styles = getPriorityStyles(priority)
  
  const volumeChange = exerciseData.volumeProgress > 0 
    ? `+${exerciseData.volumeProgress.toFixed(1)}%`
    : `${exerciseData.volumeProgress.toFixed(1)}%`

  return (
    <motion.div 
      className={cn("rounded-lg p-4", styles.container, className)}
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 'fit-content' }}
    >
      <div className="flex items-start gap-3">
        {exerciseGif && (
          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-white flex items-center justify-center">
            <Image 
              src={exerciseGif}
              alt={exerciseName}
              width={64}
              height={64}
              className="object-cover"
              unoptimized={true}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h4 className="font-medium truncate">{exerciseName}</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className={cn("h-4 w-4", styles.icon)} /> : 
                           <ChevronDown className={cn("h-4 w-4", styles.icon)} />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="bg-white text-xs flex-shrink-0">
              {muscleGroup}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("text-xs whitespace-nowrap flex-shrink-0", styles.badge)}
            >
              {priority === 'high' ? 'Urgent' : priority === 'medium' ? 'Review' : 'Minor'}
            </Badge>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {status.duration} workouts without progress
            </span>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className={cn("p-3 rounded-lg bg-white/50", styles.container)}>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Peak Weight</span>
                  </div>
                  <p className="text-lg font-semibold mt-1">{exerciseData?.maxWeight ? `${Math.round(exerciseData.maxWeight)}kg` : '0kg'}</p>                </div>
                <div className={cn("p-3 rounded-lg bg-white/50", styles.container)}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Volume Trend</span>
                  </div>
                  <p className={cn(
                    "text-lg font-semibold mt-1",
                    volumeChange.includes('+') ? 'text-green-600' : 'text-red-600'
                  )}>
                    {volumeChange}
                  </p>
                </div>
              </div>

              {showGraph && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="bg-white/50 rounded-lg p-3">
                    <h5 className="text-sm font-medium mb-3">Progress Timeline</h5>
                    <div className="h-[180px] w-full">
                      <ProgressChart
                        data={exerciseData.history}
                        maxWeight={exerciseData.maxWeight}
                        compact={true}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3 bg-white/50 rounded-lg p-3">
                <h5 className="text-sm font-medium">How to Improve</h5>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Target className={cn("h-4 w-4 mt-1 flex-shrink-0", styles.icon)} />
                    <p className="text-sm">{status.allRecommendations.technique}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart3 className={cn("h-4 w-4 mt-1 flex-shrink-0", styles.icon)} />
                    <p className="text-sm">{status.allRecommendations.volume}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowLeftRight className={cn("h-4 w-4 mt-1 flex-shrink-0", styles.icon)} />
                    <p className="text-sm">{status.allRecommendations.alternative}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 