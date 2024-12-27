import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    
    if (token_hash && type) {
      const supabase = createRouteHandlerClient({ cookies })
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'signup'
      })

      if (error) {
        return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
      }

      // Redirect to a success page or signin
      return NextResponse.redirect(new URL('/signin', requestUrl.origin))
    }

    return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
  } catch (error) {
    console.error('Error confirming user:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
}
