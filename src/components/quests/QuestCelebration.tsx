'use client'

import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy } from 'lucide-react'
import { useEffect } from 'react'

interface QuestCelebrationProps {
  show: boolean
  title: string
  reward: string
  onComplete: () => void
}

export function QuestCelebration({ show, title, reward, onComplete }: QuestCelebrationProps) {
  useEffect(() => {
    if (show) {
      const duration = 2500
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 9999 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(Number(interval))
          return
        }

        const particleCount = 75 * (timeLeft / duration)
        
        // Updated confetti colors to match new theme
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#ffb703', '#ffffff', '#023047']
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#ffb703', '#ffffff', '#023047']
        })
      }, 200)

      return () => clearInterval(Number(interval))
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div 
            className="absolute inset-0 bg-[#ffb703] bg-opacity-60 backdrop-blur-[2px]"
            onClick={onComplete}
          />
          
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
              }
            }}
            className="relative bg-[#023047] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mb-6 inline-block"
            >
              <Trophy className="w-16 h-16 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-3 text-white"
            >
              Quest Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 mb-6 text-lg"
            >
              {title}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.1, 1],
                transition: {
                  scale: {
                    repeat: Infinity,
                    duration: 2,
                    repeatType: "reverse"
                  }
                }
              }}
              className="text-2xl font-bold text-[#FFD700] mb-6 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
            >
              + {reward}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-white/60"
            >
              Tap outside to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 