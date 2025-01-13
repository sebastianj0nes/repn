'use client'

import { UserQuest } from '@/lib/quests/types'
import { QuestCard } from './QuestCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, ChevronDown } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { QuestCelebration } from './QuestCelebration'

interface QuestListProps {
  activeQuests: UserQuest[]
  completedQuests: UserQuest[]
}

export function QuestList({ activeQuests, completedQuests }: QuestListProps) {
  const [showCompleted, setShowCompleted] = useState(false)
  const [celebrationQuest, setCelebrationQuest] = useState<UserQuest | null>(null)
  
  const activeQuestsList = [...activeQuests].sort((a, b) => {
    if (a.completed && !a.reward_claimed && (!b.completed || b.reward_claimed)) return -1
    if (b.completed && !b.reward_claimed && (!a.completed || a.reward_claimed)) return 1

    const questTypeOrder = {
      onboarding: 1,
      daily: 2,
      weekly: 3,
      achievement: 4
    }
    return questTypeOrder[a.quest?.quest_type || 'daily'] - questTypeOrder[b.quest?.quest_type || 'daily']
  })

  const completedQuestsList = completedQuests
  
  const handleQuestClaim = (quest: UserQuest) => {
    setCelebrationQuest(quest)
  }

  return (
    <div className="space-y-6">
      {/* Progress Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-semibold">Quest Progress</span>
          </div>
          <span className="text-sm font-medium">
            {completedQuestsList.length} / {activeQuests.length + completedQuests.length}
          </span>
        </div>
        <Progress value={(completedQuestsList.length / (activeQuests.length + completedQuests.length)) * 100} className="h-2" />
      </motion.div>

      {/* Active Quests Section */}
      <motion.div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Active Quests
          </h2>
          <span className="text-sm text-muted-foreground">
            {activeQuestsList.length} active
          </span>
        </div>

        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {activeQuestsList.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuestCard 
                  userQuest={quest} 
                  onClaim={() => handleQuestClaim(quest)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Completed (and Claimed) Quests Section */}
      {completedQuestsList.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Completed
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <motion.div
                animate={{ rotate: showCompleted ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid gap-2 pt-2">
                  {completedQuestsList.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <QuestCard userQuest={quest} isCompleted />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Celebration Modal */}
      {celebrationQuest && celebrationQuest.quest && (
        <QuestCelebration
          show={true}
          title={celebrationQuest.quest.title}
          reward={`${celebrationQuest.quest.reward_value} ${celebrationQuest.quest.reward_type}`}
          onComplete={() => setCelebrationQuest(null)}
        />
      )}
    </div>
  )
} 