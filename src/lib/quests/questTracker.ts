import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { QuestRequirementType } from './types'

const supabase = createClientComponentClient<Database>()

export const QuestTracker = {
  // Track workout completion
  async trackWorkoutCompletion(userId: string) {
    const { data: quests } = await supabase
      .from('user_quests')
      .select('*, quest:quests(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .in('quest.requirement_type', ['workout_count', 'consecutive_workouts'])

    if (!quests) return []

    const updatedQuests = []
    
    for (const userQuest of quests) {
      if (userQuest.quest?.requirement_value) {
        const newProgress = userQuest.progress + 1
        await this.updateQuestProgress(userId, userQuest.quest_id, newProgress, userQuest.quest.requirement_value)
        if (newProgress >= userQuest.quest.requirement_value) {
          updatedQuests.push(userQuest)
        }
      }
    }

    return updatedQuests
  },

  // Track specific muscle group usage
  async trackMuscleGroup(userId: string, muscleGroup: string) {
    const { data: quests } = await supabase
      .from('user_quests')
      .select('*, quest:quests(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .eq('quest.requirement_type', 'specific_muscle_group')

    if (!quests) return

    for (const userQuest of quests) {
      if (userQuest.quest?.requirement_value) {
        const newProgress = userQuest.progress + 1
        await this.updateQuestProgress(userId, userQuest.quest_id, newProgress, userQuest.quest.requirement_value)
      }
    }
  },

  // Track exercise completion
  async trackExerciseCompletion(userId: string, exerciseId: string) {
    const { data: quests } = await supabase
      .from('user_quests')
      .select('*, quest:quests(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .in('quest.requirement_type', ['exercise_count', 'specific_exercise'])

    if (!quests) return

    for (const userQuest of quests) {
      if (userQuest.quest?.requirement_value) {
        const newProgress = userQuest.progress + 1
        await this.updateQuestProgress(userId, userQuest.quest_id, newProgress, userQuest.quest.requirement_value)
      }
    }
  },

  // Track personal best achievements
  async trackPersonalBest(userId: string) {
    const { data: quests } = await supabase
      .from('user_quests')
      .select('*, quest:quests(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .eq('quest.requirement_type', 'personal_best')

    if (!quests) return

    for (const userQuest of quests) {
      if (userQuest.quest?.requirement_value) {
        const newProgress = userQuest.progress + 1
        await this.updateQuestProgress(userId, userQuest.quest_id, newProgress, userQuest.quest.requirement_value)
      }
    }
  },

  // Update quest progress
   async updateQuestProgress(
    userId: string, 
    questId: string, 
    progress: number, 
    requirementValue: number
  ) {
    const updates = {
      progress,
      completed: progress >= requirementValue,
      completed_at: progress >= requirementValue ? new Date().toISOString() : null
    }

    await supabase
      .from('user_quests')
      .update(updates)
      .eq('user_id', userId)
      .eq('quest_id', questId)
  }
} 