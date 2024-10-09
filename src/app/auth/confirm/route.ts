import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'recovery' | 'invite'
    })

    if (!error) {
      return NextResponse.redirect(new URL('/auth/callback', requestUrl.origin))
    }
  }

  // If there's an error, redirect to the sign-in page
  return NextResponse.redirect(new URL('/signin', requestUrl.origin))
}
