'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { X, Calendar, Scale } from 'lucide-react'
import { format } from 'date-fns'
import { Photo } from '@/types/photo'

interface PhotoViewProps {
  photos: Photo[]
  initialPhotoIndex: number
  onClose: () => void
}

export default function PhotoView({ photos, initialPhotoIndex, onClose }: PhotoViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hasSeenHint, setHasSeenHint] = useState(true)
  const currentPhoto = photos[currentIndex]

  const y = useMotionValue(0)
  const opacity = useTransform(y, [-200, 0, 200], [0.2, 1, 0.2])
  const scale = useTransform(y, [-200, 0, 200], [0.8, 1, 0.8])
  const controls = useAnimation()

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const bottomNav = document.querySelector('nav');
    if (bottomNav) bottomNav.style.display = 'none';
    
    return () => {
      const bottomNav = document.querySelector('nav');
      if (bottomNav) bottomNav.style.display = 'block';
    };
  }, []);

  // Check localStorage on mount
  useEffect(() => {
    const hasSeenPhotoHint = localStorage.getItem('hasSeenPhotoHint')
    setHasSeenHint(!!hasSeenPhotoHint)
    
    if (!hasSeenPhotoHint) {
      localStorage.setItem('hasSeenPhotoHint', 'true')
    }
  }, [])

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (!hasInteracted) setHasInteracted(true)
    
    const SWIPE_THRESHOLD = 50
    const VERTICAL_THRESHOLD = 100

    if (Math.abs(info.offset.y) > VERTICAL_THRESHOLD) {
      // Close on vertical swipe
      await controls.start({ opacity: 0, scale: 0.8 })
      onClose()
      return
    }

    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      if (info.offset.x < 0 && currentIndex < photos.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    }

    // Reset position if not closing
    controls.start({ x: 0, y: 0 })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100]"
      onAnimationStart={() => {
        const bottomNav = document.querySelector('nav');
        if (bottomNav) bottomNav.style.display = 'none';
      }}
      onAnimationEnd={() => {
        const bottomNav = document.querySelector('nav');
        if (bottomNav && !document.querySelector('.fixed.inset-0.bg-black')) {
          bottomNav.style.display = 'block';
        }
      }}
    >
      <AnimatePresence>
        {!hasInteracted && !hasSeenHint && currentIndex === initialPhotoIndex && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full"
            >
              <span className="text-white text-lg font-medium">
                Swipe left or right to navigate
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-screen w-screen relative">
        {/* Info overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 right-0 z-10"
        >
          {/* Close button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-white hover:text-white/90 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Info display */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <Calendar size={20} className="text-white" />
              <span className="text-base font-medium text-white whitespace-nowrap">
                {format(new Date(currentPhoto.date), 'MMMM d, yyyy')}
              </span>
            </motion.div>
            
            {currentPhoto.user_weight && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <Scale size={20} className="text-white" />
                <span className="text-base font-medium text-white">
                  {currentPhoto.user_weight}kg
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPhoto.id}
              className="w-full h-full flex items-center justify-center"
              drag={true}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragEnd={handleDragEnd}
              dragElastic={0.4}
              style={{ y }}
              animate={controls}
            >
              <motion.img
                src={currentPhoto.signedUrl}
                alt={`Photo from ${currentPhoto.date}`}
                className="w-full h-full object-contain"
                style={{ opacity, scale }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
} 