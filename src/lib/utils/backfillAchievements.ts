import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AchievementTracker } from '@/services/achievements/tracker';

export async function backfillAchievements(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    // 1. Reset all user achievements to uncompleted
    await supabase
      .from('user_achievements')
      .update({ completed: false, completed_at: null })
      .eq('user_id', userId);

    // 2. Check achievements based on all historical data
    await AchievementTracker.checkAchievements(userId);

    // 3. Get all newly completed achievements
    const { data: completedAchievements } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId)
      .eq('completed', true);

    return {
      success: true,
      completedCount: completedAchievements?.length || 0,
      achievements: completedAchievements
    };
  } catch (error) {
    console.error('Error backfilling achievements:', error);
    return {
      success: false,
      error: 'Failed to backfill achievements'
    };
  }
} 