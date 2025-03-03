'use client'

import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

type StatsCardProps = {
  title: string
  value: string
  trend?: 'increasing' | 'decreasing' | 'neutral'
}

export function StatsCard({ title, value, trend }: StatsCardProps) {
  const getTrendIcon = () => {
    if (trend === 'increasing') return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (trend === 'decreasing') return <ArrowDownRight className="h-4 w-4 text-red-500" />
    if (trend === 'neutral') return <Minus className="h-4 w-4 text-yellow-500" />
    return null
  }

  const getTrendColor = () => {
    if (trend === 'increasing') return 'text-green-500'
    if (trend === 'decreasing') return 'text-red-500'
    if (trend === 'neutral') return 'text-yellow-500'
    return 'text-gray-500'
  }

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <div className="flex items-center justify-center gap-1">
        <span className={`text-lg font-semibold ${getTrendColor()}`}>{value}</span>
        {getTrendIcon()}
      </div>
    </div>
  )
} 