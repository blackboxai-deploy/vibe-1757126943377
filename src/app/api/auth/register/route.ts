import { NextRequest, NextResponse } from 'next/server';
import { authHelpers } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, password' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = authHelpers.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }

    // Create user
    const result = await authHelpers.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone?.trim(),
      role: 'member'
    });

    return NextResponse.json({ 
      message: 'Registration successful! You can now log in.',
      user_id: result.lastInsertRowid
    }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}