'use client'

import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

interface QuestCompletionNoticeProps {
  questCount: number
}

export function QuestCompletionNotice({ questCount }: QuestCompletionNoticeProps) {
  if (questCount === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-lg p-6 text-center space-y-4 mb-8 border border-primary/20 shadow-lg shadow-primary/5"
    >
      <motion.div 
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className="flex items-center justify-center gap-2"
      >
        <Trophy className="w-6 h-6 text-yellow-500" />
        <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
          {questCount} Quest{questCount > 1 ? 's' : ''} Completed!
        </span>
      </motion.div>
      
      <Link href="/quests" className="block w-full max-w-md mx-auto">
        <Button 
          variant="outline"
          size="lg"
          className="w-full bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 border-primary/20 transition-all duration-300"
        >
          <motion.span
            animate={{ 
              x: [0, 2, 0],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎉
          </motion.span>
          <span className="mx-2">Claim Your Rewards</span>
          <motion.span
            animate={{ 
              x: [0, 2, 0],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.75
            }}
          >
            ✨
          </motion.span>
        </Button>
      </Link>
    </motion.div>
  )
}