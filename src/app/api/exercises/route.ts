import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get('muscleGroup');

    const query = supabase
      .from('exercises_library')
      .select('*')
      .order('name');

    if (muscleGroup) {
      query.eq('muscle_group', muscleGroup);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
