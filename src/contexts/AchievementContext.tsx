'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AchievementNotification } from '@/components/achievements/AchievementNotification';
import type { Achievement } from '@/types/achievements';

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export const AchievementProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const showAchievement = useCallback((achievement: Achievement) => {
    setCurrentAchievement(achievement);
  }, []);

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      {currentAchievement && (
        <AchievementNotification
          achievement={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />
      )}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}; 