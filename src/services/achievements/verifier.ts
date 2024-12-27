import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import type { Achievement } from '@/types/achievements';

export class AchievementVerifier {
  private static supabase = createClientComponentClient<Database>();

  static async verifyAchievement(
    userId: string,
    achievement: Achievement
  ): Promise<boolean> {
    switch (achievement.category) {
      case 'weight_pr':
        return this.verifyWeightPR(userId, achievement);
      // Add other categories here when needed
      default:
        return false;
    }
  }

  private static async verifyWeightPR(
    userId: string,
    achievement: Achievement
  ): Promise<boolean> {
    if (!achievement.exercise_id || !achievement.target_weight) return false;

    const { data: exerciseSets, error } = await this.supabase
      .from('exercise_sets')
      .select(`
        weight,
        exercise_id,
        exercise:exercises (
          exercise_id
        )
      `)
      .gte('weight', achievement.target_weight)
      .eq('exercise:exercises.exercise_id', achievement.exercise_id)
      .limit(1);

    console.log('Checking achievement:', {
      name: achievement.name,
      targetWeight: achievement.target_weight,
      exerciseId: achievement.exercise_id,
      foundSets: exerciseSets,
      error
    });

    return !!exerciseSets && exerciseSets.length > 0;
  }
} 