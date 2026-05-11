import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

// Called by Vercel Cron Job daily to prevent Supabase free tier from pausing
export async function GET() {
  const { error } = await supabase
    .from('sections')
    .select('id')
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
