import { NextRequest, NextResponse } from 'next/server';
import { authHelpers } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, password' 
      }, { status: 400 });
    }

    // Authenticate user
    const user = await authHelpers.authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Generate JWT token
    const token = authHelpers.generateToken(user);
    
    // Create session
    const sessionId = authHelpers.createSession(user.id);

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      session_id: sessionId
    }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}