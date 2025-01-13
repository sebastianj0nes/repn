import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { UserQuest } from './types'

const supabase = createClientComponentClient<Database>()

export async function updateQuestProgress(userId: string, questId: string, progress: number) {
  const { data, error } = await supabase
    .from('user_quests')
    .update({ progress })
    .eq('user_id', userId)
    .eq('quest_id', questId)
    .select()

  if (error) {
    console.error('Error updating quest progress:', error)
    return null
  }

  return data
}

export async function completeQuest(userId: string, questId: string) {
  const { data, error } = await supabase
    .from('user_quests')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('quest_id', questId)
    .select()

  if (error) {
    console.error('Error completing quest:', error)
    return null
  }

  return data
}

export async function checkAndUpdateQuestProgress(userId: string, quest: UserQuest, increment: number) {
  const newProgress = quest.progress + increment
  if (newProgress >= (quest.quest?.requirement_value || 0)) {
    await completeQuest(userId, quest.quest_id)
  } else {
    await updateQuestProgress(userId, quest.quest_id, newProgress)
  }
} 