import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';
import { authHelpers } from '@/lib/auth';

export async function GET() {
  try {
    const events = dbHelpers.getUpcomingEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authHelpers.requireAuth(request);
    if (!user || !authHelpers.isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      event_type, 
      date, 
      time, 
      location, 
      contact_info, 
      registration_required, 
      max_participants 
    } = body;

    // Validate required fields
    if (!title || !description || !event_type || !date || !time || !location) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, description, event_type, date, time, location' 
      }, { status: 400 });
    }

    // Validate event type
    const validTypes = ['retreat', 'prayer-meeting', 'outreach', 'fellowship', 'service'];
    if (!validTypes.includes(event_type)) {
      return NextResponse.json({ 
        error: 'Invalid event_type. Must be one of: ' + validTypes.join(', ') 
      }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ 
        error: 'Invalid date format. Use YYYY-MM-DD' 
      }, { status: 400 });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json({ 
        error: 'Invalid time format. Use HH:MM (24-hour format)' 
      }, { status: 400 });
    }

    const result = dbHelpers.createEvent({
      title: title.trim(),
      description: description.trim(),
      event_type,
      date,
      time,
      location: location.trim(),
      contact_info: contact_info?.trim(),
      registration_required: registration_required || false,
      max_participants: max_participants || null,
      created_by: user.email
    });

    return NextResponse.json({ 
      message: 'Event created successfully',
      event_id: result.lastInsertRowid
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}