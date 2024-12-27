import { AchievementCard } from './AchievementCard';
import type { Achievement, UserAchievement } from '@/types/achievements';

interface Props {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
}

export const AchievementGrid = ({ achievements, userAchievements }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => {
        const userAchievement = userAchievements.find(
          (ua) => ua.achievement_id === achievement.id
        );
        
        if (!userAchievement) return null;

        return (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            userAchievement={userAchievement}
          />
        );
      })}
    </div>
  );
}; 