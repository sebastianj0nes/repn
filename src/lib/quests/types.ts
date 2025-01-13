export type QuestType = 'daily' | 'weekly' | 'achievement' | 'onboarding'

export type QuestRequirementType = 
  | 'workout_count'
  | 'exercise_count'
  | 'specific_exercise'
  | 'specific_muscle_group'
  | 'weight_tracking'
  | 'photo_upload'
  | 'personal_best'
  | 'consecutive_workouts'

export type QuestRewardType = 'points' | 'badge' | 'theme' | 'feature'

export interface Quest {
  id: string
  title: string
  description: string
  quest_type: QuestType
  requirement_type: QuestRequirementType
  requirement_value: number
  reward_type: QuestRewardType
  reward_value: number
  active: boolean
  created_at: string
}

export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  progress: number
  completed: boolean
  completed_at: string | null
  reward_claimed: boolean
  created_at: string
  quest?: Quest // Joined data
} 