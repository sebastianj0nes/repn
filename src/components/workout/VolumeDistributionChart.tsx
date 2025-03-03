'use client'

import { useMemo, useState } from 'react'
import { MUSCLE_GROUPS } from '@/lib/utils/workoutAnalysis'
import { Badge } from "@/components/ui/badge"
import { Info, ChevronUp, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type Workout = {
  date: string;
  muscle_group: string;
}

const COLORS = {
  Back: '#4F46E5',    // Indigo
  Chest: '#7C3AED',   // Purple
  Shoulder: '#EC4899', // Pink
  Legs: '#06B6D4',    // Cyan
  Bicep: '#10B981',   // Emerald
  Tricep: '#F59E0B',  // Amber
  Core: '#EF4444'     // Red
}

export function VolumeDistributionChart({ workouts }: { workouts: Workout[] }) {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)

  const distribution = useMemo(() => {
    const muscleGroupCounts = workouts.reduce((acc, workout) => {
      const groups = workout.muscle_group.split(',').map(g => g.trim())
      groups.forEach(group => {
        acc[group] = (acc[group] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(muscleGroupCounts).reduce((a, b) => a + b, 0)
    
    return MUSCLE_GROUPS.map(group => ({
      name: group,
      value: ((muscleGroupCounts[group] || 0) / total) * 100,
      percentage: ((muscleGroupCounts[group] || 0) / total) * 100
    })).sort((a, b) => b.value - a.value)
  }, [workouts])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {Math.round(payload[0].value)}% of workouts
          </p>
        </div>
      )
    }
    return null
  }

  // Fixed progress bar calculation
  const getProgressBarSegments = () => {
    let currentPosition = 0
    return distribution.map(entry => {
      const segment = {
        start: currentPosition,
        width: entry.percentage,
        color: COLORS[entry.name as keyof typeof COLORS],
        name: entry.name
      }
      currentPosition += entry.percentage
      return segment
    })
  }

  return (
    <div className="space-y-6">
      {/* Interactive Donut Chart */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setSelectedMuscle(distribution[index].name)}
              onMouseLeave={() => setSelectedMuscle(null)}
            >
              {distribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  className={cn(
                    "transition-opacity duration-200",
                    selectedMuscle && selectedMuscle !== entry.name ? "opacity-40" : "opacity-100"
                  )}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Combined Progress Bar */}
      <div className="relative h-6 rounded-full overflow-hidden bg-gray-100">
        {getProgressBarSegments().map((segment, index) => (
          <motion.div
            key={segment.name}
            className="absolute top-0 bottom-0 transition-all"
            initial={{ width: 0 }}
            animate={{ 
              width: `${segment.width}%`,
              left: `${segment.start}%`
            }}
            style={{ backgroundColor: segment.color }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setSelectedMuscle(segment.name)}
            onHoverEnd={() => setSelectedMuscle(null)}
          />
        ))}
      </div>

      {/* Interactive Legend */}
      <div className="grid grid-cols-2 gap-2">
        {distribution.map((entry) => (
          <motion.div
            key={entry.name}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg cursor-pointer",
              selectedMuscle === entry.name ? "bg-gray-100" : "hover:bg-gray-50"
            )}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedMuscle(selectedMuscle === entry.name ? null : entry.name)}
          >
            <Image 
              src={`/muscleGroups/${entry.name.toLowerCase()}.png`}
              alt={`${entry.name} icon`}
              width={20}
              height={20}
              className="object-contain"
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
            />
            <span className="text-sm font-medium">
              {entry.name} ({Math.round(entry.percentage)}%)
            </span>
          </motion.div>
        ))}
      </div>

      {/* Insights Section */}
      {distribution.length > 0 && (
        <div className="space-y-2">
          {/* Most Trained */}
          <motion.div 
            className="bg-green-50 p-3 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Most Trained</span>
              </div>
              <div className="flex items-center gap-2">
                <Image 
                  src={`/muscleGroups/${distribution[0].name.toLowerCase()}.png`}
                  alt={`${distribution[0].name} icon`}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <Badge 
                  variant="outline" 
                  className="bg-white"
                  style={{ 
                    color: COLORS[distribution[0].name as keyof typeof COLORS]
                  }}
                >
                  {distribution[0].name}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Train More */}
          <motion.div
            className="bg-red-50 p-3 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Train More</span>
              </div>
              <div className="flex items-center gap-2">
                {distribution.slice(-2).reverse().map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <Image 
                      src={`/muscleGroups/${entry.name.toLowerCase()}.png`}
                      alt={`${entry.name} icon`}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <Badge 
                      variant="outline" 
                      className="bg-white"
                      style={{ 
                        color: COLORS[entry.name as keyof typeof COLORS]
                      }}
                    >
                      {entry.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 