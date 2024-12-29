'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTip } from '@/context/TipContext'

interface TipProps {
  id: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function Tip({ id, children, position = 'bottom', className = '' }: TipProps) {
  const { currentTip, hideTip } = useTip()
  const isVisible = currentTip === id

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              duration: 0.5,
              bounce: 0.3
            }
          }}
          exit={{ 
            opacity: 0, 
            y: 10, 
            scale: 0.95,
            transition: { duration: 0.2 }
          }}
          whileHover={{ scale: 1.02 }}
          className={`fixed z-50 max-w-[280px] bg-gradient-to-br from-blue-500/95 to-purple-600/95 backdrop-blur-sm 
            text-white rounded-lg shadow-lg p-4 border border-white/20 ${className}`}
          style={{
            [position === 'bottom' ? 'bottom' : 'top']: position === 'bottom' ? 'calc(4rem + 1.5rem)' : '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 2rem)'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => hideTip(id)}
            className="absolute top-2 right-2 p-1 rounded-full 
              hover:bg-white/20 transition-colors"
            aria-label="Close tip"
          >
            <X size={16} />
          </motion.button>
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pr-6"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 