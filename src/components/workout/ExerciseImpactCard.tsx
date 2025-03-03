'use client'

import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Minus, Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface ExerciseImpactCardProps {
  name: string;
  data: {
    maxWeight: number;
    volumeProgress: number;
    trend: 'increasing' | 'decreasing' | 'neutral';
    maxReps?: number;
  };
  tier: 'A*' | 'A' | 'B';
  rank?: number;
  onClick?: () => void;
}

export function ExerciseImpactCard({ name, data, tier, rank, onClick }: ExerciseImpactCardProps) {
  const { maxWeight, volumeProgress, trend, maxReps } = data
  
  const getTrendIcon = () => {
    if (trend === 'increasing') return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (trend === 'decreasing') return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const getBadgeStyles = () => {
    switch(tier) {
      case 'A*':
        return {
          background: 'linear-gradient(45deg, #FFD700, #FFB700)',
          border: '1px solid #FFB700',
          color: '#000',
          textShadow: '0 1px 1px rgba(255,255,255,0.5)'
        }
      case 'A':
        return {
          background: 'linear-gradient(45deg, #4ade80, #22c55e)',
          border: '1px solid #22c55e',
          color: '#fff',
          textShadow: '0 1px 1px rgba(0,0,0,0.2)'
        }
      default:
        return {
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          color: '#374151'
        }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank ? rank * 0.1 : 0 }}
      className="relative"
    >
      <div 
        className={`p-4 rounded-lg border shadow-sm cursor-pointer 
          hover:shadow-md transition-all duration-200
          ${rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200' : 'bg-white'}`}
        onClick={onClick}
      >
        {rank === 1 && (
          <div className="absolute -top-2 -right-2">
            <Trophy className="h-5 w-5 text-yellow-500 drop-shadow" />
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {rank && (
              <span className="text-sm font-semibold text-slate-400">#{rank}</span>
            )}
            <h4 className="font-medium text-slate-900">{name}</h4>
          </div>
          <Badge style={getBadgeStyles()} className="font-semibold">
            {tier}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">
                {maxReps ? 'Max Reps' : 'Max Weight'}
              </span>
              <span className="font-medium">
                {maxReps ? `${maxReps} reps` : `${maxWeight}kg`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Volume Progress</span>
              <div className="flex items-center gap-1">
                <span className={`font-medium ${volumeProgress > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {volumeProgress > 0 ? '+' : ''}{volumeProgress.toFixed(1)}%
                </span>
                {getTrendIcon()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}