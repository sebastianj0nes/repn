import { motion, AnimatePresence } from 'framer-motion'
import { FixedSizeGrid } from 'react-window'
import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'

interface PhotoGridProps {
  photos: any[]
  lastPhotoRef: (node: HTMLDivElement) => void
}

export default function PhotoGrid({ photos, lastPhotoRef }: PhotoGridProps) {
  const gridRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 800 })
  const [columnCount, setColumnCount] = useState(4)
  const [currentMonth, setCurrentMonth] = useState('')

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const containerWidth = container.getBoundingClientRect().width
      const height = window.innerHeight - 200
      
      const newColumnCount = containerWidth < 640 ? 2 
        : containerWidth < 768 ? 3 
        : containerWidth < 1024 ? 4 
        : 4
      
      setDimensions({ width: containerWidth, height })
      setColumnCount(newColumnCount)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const cellWidth = Math.floor(dimensions.width / columnCount)
  const cellHeight = cellWidth
  const rowCount = Math.ceil(photos.length / columnCount)

  // Handle scroll to update current month
  const handleScroll = (props: { scrollTop: number }) => {
    const rowIndex = Math.floor(props.scrollTop / cellHeight)
    const photoIndex = rowIndex * columnCount
    if (photoIndex < photos.length) {
      const month = format(new Date(photos[photoIndex].date), 'MMMM')
      if (month !== currentMonth) {
        setCurrentMonth(month)
      }
    }
  }

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex
    if (index >= photos.length) return null

    const photo = photos[index]
    const isLastPhoto = index === photos.length - 1

    return (
      <div style={{ 
        ...style,
        padding: '1px',
        height: cellHeight,
        width: cellWidth
      }}>
        <motion.div
          className="relative w-full h-full group cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          ref={isLastPhoto ? lastPhotoRef : null}
        >
          <img
            src={photo.signedUrl}
            alt={`Workout from ${photo.date}`}
            className="w-full h-full object-cover rounded-sm"
            loading="lazy"
          />
          
          {/* Desktop hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-sm hidden md:flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">
              {new Date(photo.date).toLocaleDateString()}
            </p>
            {photo.user_weight && (
              <p className="text-white text-md mt-2">
                Weight: {photo.user_weight}kg
              </p>
            )}
          </div>

          {/* Mobile touch overlay */}
          <button 
            className="absolute inset-0 bg-black/60 opacity-0 active:opacity-100 transition-opacity duration-200 rounded-sm md:hidden flex flex-col items-center justify-center"
            onClick={(e) => e.preventDefault()}
          >
            <p className="text-white text-lg font-semibold">
              {new Date(photo.date).toLocaleDateString()}
            </p>
            {photo.user_weight && (
              <p className="text-white text-md mt-2">
                Weight: {photo.user_weight}kg
              </p>
            )}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-[calc(100vh-12rem)] overflow-hidden relative">
      {/* Floating month indicator with mobile fixes */}
      <AnimatePresence>
        {currentMonth && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-0 right-0 mx-auto top-[4.5rem] w-fit z-50 md:absolute md:left-1/2 md:right-auto md:top-3 md:-translate-x-1/2"
          >
            <div className="px-4 py-1.5 bg-black/90 backdrop-blur-md rounded-full shadow-xl border border-white/10 flex items-center justify-center">
              <span className="text-sm font-medium tracking-wide text-white/90">
                {currentMonth}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {dimensions.width > 0 && (
        <FixedSizeGrid
          ref={gridRef}
          columnCount={columnCount}
          columnWidth={cellWidth}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={cellHeight}
          width={dimensions.width}
          className="scrollbar-hide"
          onScroll={handleScroll}
        >
          {Cell}
        </FixedSizeGrid>
      )}
    </div>
  )
} 