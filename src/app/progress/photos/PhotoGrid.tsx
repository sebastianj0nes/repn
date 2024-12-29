'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import PhotoView from '@/components/PhotoView'
import PhotoSkeleton from '@/components/PhotoSkeleton'
import { Photo } from '@/types/photo'

interface PhotoGridProps {
  photos: Photo[]
  lastPhotoRef?: (node: HTMLDivElement) => void
}

export default function PhotoGrid({ photos, lastPhotoRef }: PhotoGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const currentMonth = photos.length > 0 ? format(new Date(photos[0].date), 'MMMM yyyy') : ''
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  
  // Only show photos with valid signedUrls
  const validPhotos = photos.filter(photo => photo.signedUrl)

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId))
  }

  return (
    <>
      {/* Month indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 z-10 mx-auto w-fit"
      >
        <div className="flex items-center gap-2 text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
          <Calendar size={18} className="text-white" />
          <span className="text-sm font-medium text-white">
            {currentMonth}
          </span>
        </div>
      </motion.div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 mt-4">
        {validPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            ref={index === validPhotos.length - 1 ? lastPhotoRef : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-square relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!loadedImages.has(photo.id) && (
                <motion.div
                  key={`skeleton-${photo.id}`}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <PhotoSkeleton />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Image
              src={photo.signedUrl!}
              alt={`Workout photo from ${photo.date}`}
              fill
              className={`object-cover hover:opacity-90 transition-opacity cursor-pointer ${
                loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setSelectedPhotoIndex(index)}
              sizes="(max-width: 768px) 33vw, 25vw"
              priority={index < 6}
              onLoad={() => handleImageLoad(photo.id)}
              loading={index < 12 ? 'eager' : 'lazy'}
            />
          </motion.div>
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <PhotoView
          photos={validPhotos}
          initialPhotoIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </>
  )
} 