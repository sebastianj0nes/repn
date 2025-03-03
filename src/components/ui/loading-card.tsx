'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export function LoadingCard() {
  return (
    <Card className="border-2 border-red-500/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          <span>Exercise Progress & Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          {/* Critical Section Loading */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-200 rounded" />
              <div className="h-4 w-32 bg-red-200 rounded" />
            </div>
            
            {/* Loading Plateau Cards */}
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg p-4 bg-red-50/50 border-2 border-red-200/50">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 bg-red-200/50 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-red-200/50 rounded" />
                    <div className="h-4 w-24 bg-red-200/50 rounded" />
                    <div className="h-4 w-full bg-red-200/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 