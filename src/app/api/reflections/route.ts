import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';
import { authHelpers } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const daily = searchParams.get('daily');
    
    if (daily) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const reflection = dbHelpers.getDailyReflection(today);
      return NextResponse.json({ reflection });
    } else {
      const reflections = dbHelpers.getPublishedReflections(limit);
      return NextResponse.json({ reflections });
    }
  } catch (error) {
    console.error('Error fetching reflections:', error);
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
    const { title, content, scripture_reference, category, is_daily, publish_date } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, content, category' 
      }, { status: 400 });
    }

    // Validate category
    const validCategories = ['daily', 'youth', 'meditation', 'scripture', 'inspiration', 'teaching'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category. Must be one of: ' + validCategories.join(', ') 
      }, { status: 400 });
    }

    // Default publish date to today if not provided
    const finalPublishDate = publish_date || new Date().toISOString().split('T')[0];

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(finalPublishDate)) {
      return NextResponse.json({ 
        error: 'Invalid publish_date format. Use YYYY-MM-DD' 
      }, { status: 400 });
    }

    const result = dbHelpers.createReflection({
      title: title.trim(),
      content: content.trim(),
      scripture_reference: scripture_reference?.trim(),
      category,
      author: user.name,
      is_daily: is_daily || false,
      publish_date: finalPublishDate
    });

    return NextResponse.json({ 
      message: 'Reflection created successfully',
      reflection_id: result.lastInsertRowid
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reflection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}