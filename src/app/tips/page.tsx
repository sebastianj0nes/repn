'use client'

import { createElement, useState } from 'react'
import { motion } from 'framer-motion'
import { useTip } from '@/context/TipContext'
import { tips } from '@/data/tips'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Dumbbell, 
  BarChart2, 
  Activity,
  Info,
  RefreshCw,
  AlertTriangle,
  LucideIcon,
  type Icon as LucideIconType
} from 'lucide-react'
import * as Icons from 'lucide-react'

export default function TipsPage() {
  const { isDismissed, resetTips } = useTip()
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Map category to icon
  const categoryIcons: Record<string, LucideIcon> = {
    workout: Dumbbell,
    progress: Activity,
    stats: BarChart2,
    general: Info
  }

  const handleResetTips = () => {
    resetTips()
    setShowResetDialog(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tips & Help</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowResetDialog(true)}
          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
        >
          <RefreshCw className="h-4 w-4" />
          Show All Tips Again
        </Button>
      </div>

      <div className="grid gap-4">
        {Object.entries(
          tips.reduce((acc, tip) => {
            if (!acc[tip.category]) acc[tip.category] = [];
            acc[tip.category].push(tip);
            return acc;
          }, {} as Record<string, typeof tips>)
        ).map(([category, categoryTips]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold capitalize mb-3 flex items-center gap-2">
              {categoryIcons[category] && createElement(categoryIcons[category], { className: "h-5 w-5" })}
              {category}
            </h2>
            <div className="grid gap-3">
              {categoryTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`
                    ${isDismissed(tip.id) ? 'opacity-50' : ''}
                    transition-opacity hover:opacity-100
                  `}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {tip.icon in Icons && 
                          createElement(
                            Icons[tip.icon as keyof typeof Icons] as React.ComponentType<any>, 
                            { className: "h-5 w-5 text-blue-500 mt-1" }
                          )
                        }
                        <div>
                          <h3 className="font-medium">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Reset All Tips
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              This will make all tips visible again, including ones you`&apos;`ve previously dismissed. 
              You`&apos;`ll start seeing tips and help messages as if you were a new user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetTips}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Reset All Tips
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 