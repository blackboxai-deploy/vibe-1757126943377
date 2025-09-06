import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';
import { authHelpers } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const pending = searchParams.get('pending') === 'true';

    if (pending) {
      // Admin only - get pending prayers
      const user = authHelpers.requireAuth(request);
      if (!user || !authHelpers.isAdmin(user)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const prayers = dbHelpers.getPendingPrayers();
      return NextResponse.json({ prayers });
    } else {
      // Public - get approved prayers
      const prayers = dbHelpers.getApprovedPrayers(limit);
      return NextResponse.json({ prayers });
    }
  } catch (error) {
    console.error('Error fetching prayers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, submitted_by, email, is_anonymous } = body;

    // Validate required fields
    if (!title || !content || !category || !submitted_by) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, content, category, submitted_by' 
      }, { status: 400 });
    }

    // Validate category
    const validCategories = ['health', 'family', 'guidance', 'thanksgiving', 'general'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category. Must be one of: ' + validCategories.join(', ') 
      }, { status: 400 });
    }

    const result = dbHelpers.createPrayer({
      title: title.trim(),
      content: content.trim(),
      category,
      submitted_by: submitted_by.trim(),
      email: email?.trim(),
      is_anonymous: is_anonymous || false
    });

    return NextResponse.json({ 
      message: 'Prayer request submitted successfully. It will be reviewed before appearing publicly.',
      prayer_id: result.lastInsertRowid
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating prayer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = authHelpers.requireAuth(request);
    if (!user || !authHelpers.isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prayer_id, action } = body;

    if (!prayer_id || !action) {
      return NextResponse.json({ 
        error: 'Missing required fields: prayer_id, action' 
      }, { status: 400 });
    }

    if (action === 'approve') {
      const result = dbHelpers.approvePrayer(prayer_id);
      
      if (result.changes === 0) {
        return NextResponse.json({ error: 'Prayer not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Prayer approved successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating prayer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}