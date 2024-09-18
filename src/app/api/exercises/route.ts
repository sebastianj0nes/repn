import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const muscleGroup = searchParams.get('muscleGroup');

  const supabase = createRouteHandlerClient({ cookies });

  const query = supabase.from('exercises_library').select('*');
  
  if (muscleGroup) {
    query.eq('muscle_group', muscleGroup);
  }

  const { data, error } = await query.order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
