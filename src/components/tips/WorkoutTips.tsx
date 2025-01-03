'use client'

import { useEffect } from 'react'
import { useTip } from '@/context/TipContext'
import Tip from '@/components/Tip'
import { Info, Star, ArrowDownToLine, ThumbsUp, Scale, Camera } from 'lucide-react'

export const MuscleGroupSelectionTip = () => {
  const { showTip } = useTip()

  useEffect(() => {
    const timer = setTimeout(() => {
      showTip('muscle-group-selection')
    }, 1000) // Show after 1 second

    return () => clearTimeout(timer)
  }, [showTip])

  return (
    <Tip id="muscle-group-selection" className="max-w-[300px]">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">Quick Tip 💪</p>
          <p className="text-xs text-gray-200">
            Select all muscle groups you plan to work out today.
          </p>
        </div>
      </div>
    </Tip>
  )
}

export const SetOfDayTip = () => {
  const { showTip } = useTip()

  useEffect(() => {
    const timer = setTimeout(() => {
      showTip('set-of-the-day')
    }, 1000)
    return () => clearTimeout(timer)
  }, [showTip])

  return (
    <Tip id="set-of-the-day" position="bottom" className="max-w-[300px]">
      <div className="flex items-start gap-2">
        <Star className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">Quick Tip ⭐</p>
          <p className="text-xs text-gray-200">
            Mark your best set of the day with the star icon. <br/> The &apos;best&apos; set is up to you, it doesn&apos;t have to be the heaviest set! 
          </p>
        </div>
      </div>
    </Tip>
  )
}

export const DropsetTip = () => {
  const { showTip, isDismissed } = useTip()

  useEffect(() => {
    // Only show dropset tip if set-of-the-day tip has been dismissed
    if (isDismissed('set-of-the-day')) {
      const timer = setTimeout(() => {
        showTip('dropset-tracking')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showTip, isDismissed])

  return (
    <Tip id="dropset-tracking" position="bottom" className="max-w-[300px]">
      <div className="flex items-start gap-2">
        <ArrowDownToLine className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">Quick Tip 💪</p>
          <p className="text-xs text-gray-200">
            Dropsets are when you decrease the weight after completing a set and continue the exercise without break. Toggle the dropset tab to track both weights for each set!
          </p>
        </div>
      </div>
    </Tip>
  )
}

export const WorkoutFeelingTip = () => {
  const { showTip, isDismissed } = useTip()

  useEffect(() => {
    // Only show after previous tips have been dismissed
    if (isDismissed('dropset-tracking')) {
      const timer = setTimeout(() => {
        showTip('workout-feeling')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showTip, isDismissed])

  return (
    <Tip id="workout-feeling" position="bottom" className="max-w-[300px]">
      <div className="flex items-start gap-2">
        <ThumbsUp className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">Quick Tip 💪</p>
          <p className="text-xs text-gray-200">
          Your workout rating helps track patterns in your performance. Be honest - even challenging days provide valuable insights!
          </p>
        </div>
      </div>
    </Tip>
  )
}

export const WeightTrackingTip = () => {
  const { showTip } = useTip()

  useEffect(() => {
    const timer = setTimeout(() => {
      showTip('weight-tracking')
    }, 1000)
    return () => clearTimeout(timer)
  }, [showTip])

  return (
    <Tip id="weight-tracking" position="bottom" className="max-w-[300px]">
      <div className="flex items-start gap-2 px-2">
        <Scale className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">Quick Tip 📊</p>
          <p className="text-xs text-gray-200">
            Optional: Track your body weight to see how it changes with your workouts!
          </p>
        </div>
      </div>
    </Tip>
  )
}

export const WorkoutPhotoTip = () => {
  const { showTip, isDismissed } = useTip()

  useEffect(() => {
    // Only show after weight tracking tip has been dismissed
    if (isDismissed('weight-tracking')) {
      const timer = setTimeout(() => {
        showTip('workout-photo')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showTip, isDismissed])

  return (
    <Tip id="workout-photo" position="bottom" className="max-w-[300px]">
      <div className="flex items-start gap-2">
        <Camera className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">Quick Tip 📸</p>
          <p className="text-xs text-gray-200">
            Optional: Add a photo to track your visual progress and keep yourself motivated!
          </p>
        </div>
      </div>
    </Tip>
  )
} 