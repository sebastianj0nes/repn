'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface ProgressChartProps {
  data: Array<{
    date: string
    weight: number
    volume: number
  }>
  maxWeight?: number
  compact?: boolean
}

export function ProgressChart({ data, maxWeight, compact = false }: ProgressChartProps) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        ...item,
        date: format(new Date(item.date), 'MMM d')
      }))
  }, [data])

  if (chartData.length < 2) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Not enough data to show progress chart</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData} 
          margin={{ top: 25, right: 10, bottom: 0, left: -20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-5}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border text-xs space-y-1">
                  <p className="font-medium border-b pb-1">{payload[0].payload.date}</p>
                  <p className="text-emerald-600">Volume: {payload[0].payload.volume}kg</p>
                  <p className="text-blue-600">Weight: {payload[0].payload.weight}kg</p>
                  {maxWeight && payload[0].payload.weight === maxWeight && (
                    <p className="text-purple-600 font-medium pt-1">🏆 Peak Weight</p>
                  )}
                </div>
              )
            }}
          />
          <Line 
            type="monotone" 
            dataKey="volume" 
            stroke="#059669" 
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#059669', strokeWidth: 0, cursor: 'pointer' }}
            activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}