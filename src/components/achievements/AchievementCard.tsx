import Image from 'next/image';
import type { Achievement, UserAchievement } from '@/types/achievements';

interface Props {
  achievement: Achievement;
  userAchievement: UserAchievement;
}

export const AchievementCard = ({ achievement, userAchievement }: Props) => {
  return (
    <div className={`
      p-4 rounded-lg border
      ${userAchievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
    `}>
      <div className="flex items-center gap-4">
        {achievement.image_url && (
          <Image
            src={achievement.image_url}
            alt={achievement.name}
            width={64}
            height={64}
            className="rounded-lg"
          />
        )}
        <div>
          <h3 className="font-bold text-lg">{achievement.name}</h3>
          <p className="text-gray-600">{achievement.description}</p>
          {userAchievement.completed && (
            <p className="text-green-600 text-sm mt-1">
              Completed on {new Date(userAchievement.completed_at!).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 