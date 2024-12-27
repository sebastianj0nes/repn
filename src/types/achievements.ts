export type AchievementCategory = 'weight_pr' | 'volume_pr' | 'frequency' | 'streak';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  exercise_id?: string;
  target_weight?: number;
  created_at?: string;
  image_url?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  completed: boolean;
  completed_at?: string;
  achievement: Achievement[];
} 