'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Calendar, Scale } from 'lucide-react'
import { format } from 'date-fns'
import { Photo } from '@/types/photo'

interface PhotoViewProps {
  photos: Photo[]
  initialPhotoIndex: number
  onClose: () => void
}

export default function PhotoView({ photos, initialPhotoIndex, onClose }: PhotoViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex)
  const currentPhoto = photos[currentIndex]

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const SWIPE_THRESHOLD = 50
    if (info.offset.x < -SWIPE_THRESHOLD && currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (info.offset.x > SWIPE_THRESHOLD && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50"
    >
      <div className="h-full flex flex-col">
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
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPhoto.id}
              className="w-full h-full flex items-center justify-center"
              onDragEnd={handleDragEnd}
              onPanEnd={handleDragEnd}
              dragElastic={0.1}
            >
              <motion.img
                src={currentPhoto.signedUrl}
                alt={`Photo from ${currentPhoto.date}`}
                className="max-h-[100vh] max-w-[100vw] object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute inset-x-0 flex justify-between px-4 pointer-events-none">
            {currentIndex > 0 && (
              <motion.button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="text-white/80 hover:text-white pointer-events-auto p-2"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={36} />
              </motion.button>
            )}
            {currentIndex < photos.length - 1 && (
              <motion.button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="text-white/80 hover:text-white pointer-events-auto p-2"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={36} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 