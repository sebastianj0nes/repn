'use client'

import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useQuests } from "@/contexts/QuestContext"

interface QuestCompletionNoticeProps {
  questCount: number
}

export function QuestCompletionNotice({ questCount }: QuestCompletionNoticeProps) {
  const router = useRouter()
  const { refreshQuests } = useQuests()
  
  if (questCount === 0) return null

  const handleClaimClick = async () => {
    await refreshQuests()
    router.push('/quests')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-primary/10 rounded-lg p-4 text-center space-y-3 mt-6"
    >
      <div className="flex items-center justify-center gap-2 text-primary">
        <Trophy className="w-5 h-5" />
        <span className="font-semibold">
          {questCount} Quest{questCount > 1 ? 's' : ''} Completed!
        </span>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full border-primary/20 hover:bg-primary/5"
        onClick={handleClaimClick}
      >
        Claim Your Rewards
      </Button>
    </motion.div>
  )
} 