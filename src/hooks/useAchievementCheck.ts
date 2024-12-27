import { useCallback } from 'react';
import { AchievementTracker } from '@/services/achievements/tracker';

export const useAchievementCheck = (userId: string) => {
  const checkAchievements = useCallback(async () => {
    await AchievementTracker.checkAchievements(userId);
  }, [userId]);

  return { checkAchievements };
}; 