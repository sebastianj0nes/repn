'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Quest, UserQuest } from '@/lib/quests/types'
import { Database } from '@/lib/database.types'

interface QuestContextType {
  activeQuests: UserQuest[]
  completedQuests: UserQuest[]
  refreshQuests: () => Promise<void>
  claimReward: (questId: string) => Promise<void>
}

const QuestContext = createContext<QuestContextType | undefined>(undefined)

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [activeQuests, setActiveQuests] = useState<UserQuest[]>([])
  const [completedQuests, setCompletedQuests] = useState<UserQuest[]>([])
  const supabase = createClientComponentClient<Database>()

  const refreshQuests = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: userQuests, error } = await supabase
      .from('user_quests')
      .select(`
        *,
        quest:quests(*)
      `)
      .eq('user_id', user.id)

    console.log('User Quests Data:', userQuests)

    if (error) {
      console.error('Error fetching quests:', error)
      return
    }

    setActiveQuests(userQuests.filter(uq => !uq.completed || (uq.completed && !uq.reward_claimed)))
    setCompletedQuests(userQuests.filter(uq => uq.completed && uq.reward_claimed))
  }

  const claimReward = async (questId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_quests')
      .update({ reward_claimed: true })
      .eq('quest_id', questId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error claiming reward:', error)
      return
    }

    setActiveQuests(prev => prev.filter(q => q.quest?.id !== questId))
    setCompletedQuests(prev => [
      ...prev,
      ...activeQuests.filter(q => q.quest?.id === questId).map(q => ({
        ...q,
        reward_claimed: true
      }))
    ])

    await refreshQuests()
  }

  useEffect(() => {
    refreshQuests()
  }, [])

  return (
    <QuestContext.Provider value={{
      activeQuests,
      completedQuests,
      refreshQuests,
      claimReward
    }}>
      {children}
    </QuestContext.Provider>
  )
}

export const useQuests = () => {
  const context = useContext(QuestContext)
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider')
  }
  return context
} 