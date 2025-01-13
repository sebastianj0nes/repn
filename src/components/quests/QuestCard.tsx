'use client'

import { UserQuest } from '@/lib/quests/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useQuests } from '@/contexts/QuestContext'
import { Trophy } from 'lucide-react'
import { QuestBadge } from './QuestBadge'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface QuestCardProps {
  userQuest: UserQuest
  isCompleted?: boolean
  onClaim?: (quest: UserQuest) => void
}

export function QuestCard({ userQuest, isCompleted = false, onClaim }: QuestCardProps) {
  const { claimReward } = useQuests()
  const quest = userQuest.quest

  // Calculate progress percentage with validation
  const progress = Number(userQuest.progress) || 0
  const requirement = Number(quest?.requirement_value) || 1
  const progressPercentage = Math.min((progress / requirement) * 100, 100)

  const handleClaimReward = async () => {
    if (onClaim) {
      onClaim(userQuest)
    }
    try {
      await claimReward(quest?.id || '')
    } catch (error) {
      console.error('Error claiming reward:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative", isCompleted && "opacity-75")}
    >
      <Card>
        <div className="p-4 space-y-4">
          {/* Quest Info */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-base">{quest?.title || 'Quest'}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {quest?.description || 'No description available'}
              </p>
            </div>
                <QuestBadge type={quest?.quest_type || 'daily'} requirementType={quest?.requirement_type || 'consecutive_workouts'} />
          </div>

          {/* Progress Text */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">
              {progress} / {requirement}
            </span>
            <span>{quest?.reward_value} {quest?.reward_type}</span>
          </div>

          {/* Claim Button */}
          <AnimatePresence>
            {userQuest.completed && !userQuest.reward_claimed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={handleClaimReward}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Claim Reward
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar at bottom */}
        <div className="mt-auto">
          <Progress value={progressPercentage} className="h-2 rounded-none rounded-b-lg" />
        </div>
      </Card>
    </motion.div>
  )
}

function getBorderColor(type: string): string {
  switch (type) {
    case 'daily':
      return 'border-l-blue-500'
    case 'weekly':
      return 'border-l-purple-500'
    case 'achievement':
      return 'border-l-amber-500'
    default:
      return 'border-l-green-500'
  }
} 