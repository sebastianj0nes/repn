import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the muscle group from query params if it exists
    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get('muscleGroup');
    const muscleGroups = searchParams.get('muscleGroups')?.split(',');

    let query = supabase
      .from('exercises_library')
      .select('*')
      .order('name');

    // Apply filters based on parameters
    if (muscleGroup) {
      query = query.eq('muscle_group', muscleGroup);
    } else if (muscleGroups && muscleGroups.length > 0) {
      query = query.in('muscle_group', muscleGroups);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in exercises route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
