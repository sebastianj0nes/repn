'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trophy } from 'lucide-react'
import { Quest } from '@/lib/quests/types'
import { Button } from '@/components/ui/button'

interface QuestRewardDialogProps {
  isOpen: boolean
  onClose: () => void
  quest: Quest
  onClaim: () => void
}

export function QuestRewardDialog({ 
  isOpen, 
  onClose, 
  quest, 
  onClaim 
}: QuestRewardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Quest Completed! 🎉</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Trophy className="w-16 h-16 text-primary animate-bounce" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold">{quest.title}</h3>
            <p className="text-sm text-muted-foreground">{quest.description}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-primary">
              Reward: {quest.reward_value} {quest.reward_type}
            </p>
          </div>
          <Button onClick={onClaim} className="w-full">
            Claim Reward
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 