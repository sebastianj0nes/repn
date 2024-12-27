'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { UserContext } from '@/app/UserContext'
import BottomNav from './BottomNav'
import { usePathname, useRouter } from 'next/navigation'

// Define public routes that don't require authentication
const publicRoutes = ['/signin', '/signup', '/auth/confirm', '/auth/callback', '/auth/error']

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      setIsLoading(false)

      // If not on a public route and no session, redirect to signin
      if (!publicRoutes.includes(pathname) && !currentSession) {
        router.push('/signin')
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession)
        
        // Handle auth state changes
        if (!currentSession && !publicRoutes.includes(pathname)) {
          router.push('/signin')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ session }}>
      {children}
      {/* Only show BottomNav if user is authenticated */}
      {session && <BottomNav />}
    </UserContext.Provider>
  )
}
