import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export class UsageAnalytics {
    private static supabase = createClientComponentClient()
  
    static async getDailyUsage(startDate: Date, endDate: Date) {
      const { data, error } = await this.supabase
        .from('usage_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
  
      if (error) throw error
  
      return data.reduce((acc, log) => {
        const date = log.timestamp.split('T')[0]
        acc[date] = acc[date] || { total: 0, cached: 0, uncached: 0 }
        acc[date].total += log.bytes_transferred
        if (log.cached) {
          acc[date].cached += log.bytes_transferred
        } else {
          acc[date].uncached += log.bytes_transferred
        }
        return acc
      }, {})
    }
  
    static async getUsageByType(startDate: Date, endDate: Date) {
      const { data, error } = await this.supabase
        .from('usage_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
  
      if (error) throw error
  
      return data.reduce((acc, log) => {
        acc[log.operation_type] = acc[log.operation_type] || 0
        acc[log.operation_type] += log.bytes_transferred
        return acc
      }, {})
    }
  }