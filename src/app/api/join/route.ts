import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';
import { authHelpers } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authHelpers.requireAuth(request);
    if (!user || !authHelpers.isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const joinRequests = dbHelpers.getPendingJoinRequests();
    return NextResponse.json({ join_requests: joinRequests });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, age, interests, volunteer_areas, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate age if provided
    if (age && (age < 13 || age > 120)) {
      return NextResponse.json({ 
        error: 'Age must be between 13 and 120' 
      }, { status: 400 });
    }

    const result = dbHelpers.createJoinRequest({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      age: age || null,
      interests: interests?.trim(),
      volunteer_areas: volunteer_areas?.trim(),
      message: message?.trim()
    });

    return NextResponse.json({ 
      message: 'Thank you for your interest in joining Bellator Christo! We will contact you soon.',
      request_id: result.lastInsertRowid
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating join request:', error);
    
    // Check if it's a unique constraint error (duplicate email)
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'A request with this email address already exists' 
      }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}