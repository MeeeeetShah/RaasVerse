import { NextResponse } from 'next/server';
import { db } from '@/lib/nosql';
import { verifySuperAdmin } from '@/lib/auth';

// GET /api/events/[id] - Public single event
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = db.findById('events', id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error in GET /api/events/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id] - Protected (Super Admin only)
export async function PUT(request, { params }) {
  try {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = db.findById('events', id);
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const body = await request.json();

    const updates = {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.festival !== undefined && { festival: body.festival }),
      ...(body.city !== undefined && { city: body.city }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.venue !== undefined && { venue: body.venue }),
      ...(body.badge !== undefined && { badge: body.badge }),
      ...(body.trending !== undefined && { trending: Boolean(body.trending) }),
      ...(body.order !== undefined && { order: Number(body.order) }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.dateRange !== undefined && { dateRange: body.dateRange }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.layoutImage !== undefined && { layoutImage: body.layoutImage }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.dates !== undefined && { dates: body.dates })
    };

    const updated = db.updateOne('events', id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/events/[id]:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Protected (Super Admin only)
export async function DELETE(request, { params }) {
  try {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = db.deleteOne('events', id);
    if (!deleted) {
      return NextResponse.json({ error: 'Event not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Event ${id} deleted successfully` });
  } catch (error) {
    console.error('Error in DELETE /api/events/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
