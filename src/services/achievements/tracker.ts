import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { AchievementVerifier } from './verifier';
import type { Achievement } from '@/types/achievements';

export class AchievementTracker {
  private static supabase = createClientComponentClient<Database>();

  static async checkAchievements(userId: string): Promise<void> {
    // Get all incomplete achievements for user
    const { data: userAchievements } = await this.supabase
      .from('user_achievements')
      .select(`
        id,
        user_id,
        achievement_id,
        completed,
        achievements:achievement_id (
          id,
          name,
          description,
          category,
          exercise_id,
          target_weight,
          created_at
        )
      `)
      .eq('user_id', userId)
      .eq('completed', false);

    if (!userAchievements) return;

    // Check each achievement
    for (const userAchievement of userAchievements) {
      const achievement = userAchievement.achievements[0] as Achievement;
      const isCompleted = await AchievementVerifier.verifyAchievement(userId, achievement);

      if (isCompleted) {
        await this.markAchievementComplete(userAchievement.id);
      }
    }
  }

  private static async markAchievementComplete(userAchievementId: string): Promise<void> {
    await this.supabase
      .from('user_achievements')
      .update({
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', userAchievementId);
  }

  // Call this when a new user signs up
  static async assignInitialAchievements(userId: string): Promise<void> {
    const { data: achievements } = await this.supabase
      .from('achievements')
      .select('id');

    if (!achievements) return;

    const userAchievements = achievements.map(achievement => ({
      user_id: userId,
      achievement_id: achievement.id,
      completed: false
    }));

    await this.supabase
      .from('user_achievements')
      .insert(userAchievements);
  }
} 