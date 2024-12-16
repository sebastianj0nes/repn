import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirect to the homepage after successful confirmation
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  } catch (error) {
    console.error('Error confirming user:', error)
    // Redirect to error page if something goes wrong
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
}
