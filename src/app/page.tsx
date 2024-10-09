'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/signin')
      } else {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [supabase.auth, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Dashboard/>
  )
}