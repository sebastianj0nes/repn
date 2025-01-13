'use client'

import { useQuests } from '@/contexts/QuestContext'
import { QuestList } from '@/components/quests/QuestList'
import { Dumbbell } from 'lucide-react'

export default function QuestsPage() {
  const { activeQuests, completedQuests } = useQuests()

  if (!activeQuests || !completedQuests) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Dumbbell className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 px-4 py-6 mb-16">
      <div className="container max-w-md mx-auto">
        <QuestList 
          activeQuests={activeQuests}
          completedQuests={completedQuests}
        />
      </div>
    </div>
  )
} 