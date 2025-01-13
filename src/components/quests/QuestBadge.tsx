'use client'

import { QuestRequirementType, QuestType } from '@/lib/quests/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface QuestBadgeProps {
  type: QuestType
  requirementType: QuestRequirementType
  className?: string
}

const typeConfig: Record<QuestType, {
  label: string,
  bgColor: string,
  textColor: string,
  borderColor: string,
  icon: React.ReactNode
}> = {
  daily: {
    label: 'Daily',
    bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    icon: '🌟'
  },
  weekly: {
    label: 'Weekly',
    bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500/30',
    icon: '🎯'
  },
  achievement: {
    label: 'Achievement',
    bgColor: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    icon: '🏆'
  },
  onboarding: {
    label: 'Starter',
    bgColor: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/30',
    icon: '✨'
  }
}

export function QuestBadge({ type, requirementType, className }: QuestBadgeProps) {
  const config = typeConfig[type]

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full",
        "border backdrop-blur-sm shadow-sm",
        config.bgColor,
        config.textColor,
        config.borderColor,
        "transition-all duration-300",
        className
      )}
    >
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{
          repeat: Infinity,
          repeatDelay: 3,
          duration: 1,
        }}
      >
        {config.icon}
      </motion.span>
      <span className="font-semibold text-xs tracking-wide">
        {config.label}
      </span>
    </motion.div>
  )
} 