import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AchievementTracker } from '@/services/achievements/tracker';

export async function checkAchievementsAfterWorkout(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    await AchievementTracker.checkAchievements(userId);
    
    // Fetch any newly completed achievements
    const { data: newAchievements } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId)
      .eq('completed', true)
      .gt('completed_at', new Date(Date.now() - 5000).toISOString()); // Last 5 seconds

    if (newAchievements && newAchievements.length > 0) {
      // Dispatch events for each new achievement
      newAchievements.forEach(ua => {
        const event = new CustomEvent('achievementUnlocked', {
          detail: ua.achievements
        });
        window.dispatchEvent(event);
      });
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
} 