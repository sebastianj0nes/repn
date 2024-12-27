'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Achievement } from '@/types/achievements';

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
        >
          {achievement.image_url && (
            <Image
              src={achievement.image_url}
              alt={achievement.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <h3 className="font-bold">Achievement Unlocked!</h3>
            <p>{achievement.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 