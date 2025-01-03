import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UsageLog {
  id?: string
  timestamp: string
  operation_type: 'image_fetch' | 'image_upload' | 'data_fetch' | 'signed_url'
  bytes_transferred: number
  resource_path: string
  user_id: string
  cached: boolean
}

export class UsageLogger {
  private static supabase = createClientComponentClient()

  static async logUsage(data: Omit<UsageLog, 'id' | 'timestamp'>) {
    try {
      const { error } = await this.supabase
        .from('usage_logs')
        .insert({
          ...data,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to log usage:', error)
    }
  }

  static calculateBytes(data: any): number {
    return new TextEncoder().encode(JSON.stringify(data)).length
  }
}