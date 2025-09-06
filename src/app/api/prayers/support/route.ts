import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';
import { authHelpers } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prayer_id } = body;

    if (!prayer_id) {
      return NextResponse.json({ 
        error: 'Missing required field: prayer_id' 
      }, { status: 400 });
    }

    // Get client IP to prevent duplicate support
    const clientIP = authHelpers.getClientIP(request);
    
    const result = dbHelpers.addPrayerSupport(prayer_id, clientIP);

    if (result.changes === 0) {
      return NextResponse.json({ 
        message: 'You have already prayed for this request',
        already_supported: true
      }, { status: 200 });
    }

    return NextResponse.json({ 
      message: 'Thank you for praying! Your support has been recorded.',
      prayer_id,
      already_supported: false
    }, { status: 200 });
  } catch (error) {
    console.error('Error adding prayer support:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}