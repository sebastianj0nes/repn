import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AchievementGrid } from '@/components/achievements/AchievementGrid';
import { redirect } from 'next/navigation';
import { BackfillButton } from '@/components/achievements/BackfillButton';
import { Achievement, UserAchievement } from '@/types/achievements';

export default async function AchievementsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select(`
      id,
      user_id,
      achievement_id,
      completed,
      completed_at,
      achievement:achievements (
        id,
        name,
        description,
        category,
        exercise_id,
        target_weight
      )
    `)
    .eq('user_id', user.id);

  const completed = userAchievements?.filter(ua => ua.completed) || [];
  const inProgress = userAchievements?.filter(ua => !ua.completed) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Achievements</h1>
      
      {user && (
        <BackfillButton userId={user.id} />
      )}

      {(!userAchievements || userAchievements.length === 0) ? (
        <div className="text-center py-8">
          <h2 className="text-xl text-gray-600">No achievements yet</h2>
          <p className="text-gray-500 mt-2">Complete workouts to unlock achievements!</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Completed ({completed.length})</h2>
            <AchievementGrid 
              achievements={completed.map(ua => ua.achievement[0] as Achievement)}
              userAchievements={completed}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">In Progress ({inProgress.length})</h2>
            <AchievementGrid 
              achievements={inProgress.map(ua => ua.achievement[0] as Achievement)}
              userAchievements={inProgress as unknown as UserAchievement[]}
            />
          </div>
        </>
      )}
    </div>
  );
} 