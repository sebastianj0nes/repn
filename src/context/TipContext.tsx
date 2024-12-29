'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type TipId = string
type TipPosition = 'top' | 'bottom' | 'left' | 'right'

interface Tip {
  id: TipId
  position: TipPosition
  delay?: number // Delay before showing in ms
  maxShows?: number // Maximum times to show this tip
}

interface TipContextType {
  showTip: (tipId: TipId) => void
  hideTip: (tipId: TipId) => void
  isDismissed: (tipId: TipId) => boolean
  currentTip: TipId | null
  resetTips: () => void
}

const TipContext = createContext<TipContextType | undefined>(undefined)

export function TipProvider({ children }: { children: React.ReactNode }) {
  const [currentTip, setCurrentTip] = useState<TipId | null>(null)
  const [dismissedTips, setDismissedTips] = useState<Set<TipId>>(() => {
    // Load dismissed tips from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dismissedTips')
      return new Set(saved ? JSON.parse(saved) : [])
    }
    return new Set()
  })

  const showTip = (tipId: TipId) => {
    if (!dismissedTips.has(tipId)) {
      setCurrentTip(tipId)
    }
  }

  const hideTip = (tipId: TipId) => {
    setCurrentTip(null)
    setDismissedTips(prev => {
      const next = new Set(prev).add(tipId)
      localStorage.setItem('dismissedTips', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const isDismissed = (tipId: TipId) => dismissedTips.has(tipId)

  const resetTips = () => {
    setDismissedTips(new Set())
    localStorage.removeItem('dismissedTips')
  }

  return (
    <TipContext.Provider value={{ 
      showTip, 
      hideTip, 
      isDismissed, 
      currentTip,
      resetTips
    }}>
      {children}
    </TipContext.Provider>
  )
}

export const useTip = () => {
  const context = useContext(TipContext)
  if (context === undefined) {
    throw new Error('useTip must be used within a TipProvider')
  }
  return context
} 