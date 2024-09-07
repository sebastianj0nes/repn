'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { UserContext } from '@/app/UserContext'
import BottomNav from './BottomNav'  // Import the BottomNav component

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])
  return (
    <UserContext.Provider value={{ session }}>
      {children}
      {session && <BottomNav />}  
    </UserContext.Provider>
  )
}
