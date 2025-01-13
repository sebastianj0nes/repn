'use client'

import { UserQuest } from '@/lib/quests/types'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy } from 'lucide-react'

interface QuestProgressProps {
  activeQuests: UserQuest[]
  completedQuests: UserQuest[]
}

export function QuestProgress({ activeQuests, completedQuests }: QuestProgressProps) {
  const totalQuests = activeQuests.length + completedQuests.length
  const progressPercentage = (completedQuests.length / totalQuests) * 100

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-semibold">Quest Progress</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {completedQuests.length} / {totalQuests}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardContent>
    </Card>
  )
} 