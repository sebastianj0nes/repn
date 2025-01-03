'use client'

import { useState, useEffect } from 'react'
import { UsageAnalytics } from '@/lib/utils/usageAnalytics'

export default function UsageDashboard() {
  const [dailyUsage, setDailyUsage] = useState<any>(null)
  const [usageByType, setUsageByType] = useState<any>(null)

  useEffect(() => {
    const fetchUsage = async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30) // Last 30 days
      const endDate = new Date()

      const daily = await UsageAnalytics.getDailyUsage(startDate, endDate)
      const byType = await UsageAnalytics.getUsageByType(startDate, endDate)

      setDailyUsage(daily)
      setUsageByType(byType)
    }

    fetchUsage()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Usage Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Daily Usage</h2>
          {dailyUsage && Object.entries(dailyUsage).map(([date, usage]: [string, any]) => (
            <div key={date} className="mb-2">
              <p className="font-medium">{date}</p>
              <p>Total: {(usage.total / 1024 / 1024).toFixed(2)} MB</p>
              <p>Cached: {(usage.cached / 1024 / 1024).toFixed(2)} MB</p>
              <p>Uncached: {(usage.uncached / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Usage by Type</h2>
          {usageByType && Object.entries(usageByType).map(([type, bytes]: [string, any]) => (
            <div key={type} className="mb-2">
              <p className="font-medium">{type}</p>
              <p>{(bytes / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}