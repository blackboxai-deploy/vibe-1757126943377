import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, name, email, phone, message } = body;

    // Validate required fields
    if (!event_id || !name || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: event_id, name, email' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    const result = dbHelpers.registerForEvent({
      event_id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      message: message?.trim()
    });

    return NextResponse.json({ 
      message: 'Registration successful! You will receive a confirmation email shortly.',
      registration_id: result.lastInsertRowid
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    
    // Check if it's a unique constraint error (duplicate registration)
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'You have already registered for this event' 
      }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}