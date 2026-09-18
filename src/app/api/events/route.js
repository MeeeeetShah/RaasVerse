import { NextResponse } from 'next/server';
import { db } from '@/lib/nosql';
import { verifySuperAdmin } from '@/lib/auth';
import { getEventStartingPrice } from '@/lib/pricing';

// GET /api/events - Public endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trending = searchParams.get('trending');
    const search = searchParams.get('search')?.toLowerCase().trim();
    const city = searchParams.get('city');

    let events = db.find('events');

    // Filter by trending
    if (trending === 'true') {
      events = events.filter(e => e.trending === true);
    }

    // Filter by search query
    if (search) {
      events = events.filter(e => {
        const text = [
          e.title,
          e.city,
          e.location,
          e.venue,
          e.festival,
          e.badge,
          e.description
        ].filter(Boolean).join(' ').toLowerCase();
        return text.includes(search);
      });
    }

    // Filter by city
    if (city) {
      events = events.filter(e => e.city?.toLowerCase() === city.toLowerCase());
    }

    // Sort by order ascending
    events.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Protected (Super Admin only)
export async function POST(request) {
  try {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Event title is required.' }, { status: 400 });
    }

    const newEvent = {
      title: body.title.trim(),
      festival: body.festival || 'Navratri 2026',
      city: body.city || 'Ahmedabad',
      location: body.location || '',
      venue: body.venue || '',
      badge: body.badge || '',
      trending: Boolean(body.trending),
      order: Number(body.order) || 1,
      price: getEventStartingPrice({ dates: body.dates, price: body.price }),
      dateRange: body.dateRange || '',
      image: body.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
      layoutImage: body.layoutImage || '',
      description: body.description || '',
      features: Array.isArray(body.features) ? body.features : [],
      venueFeatures: Array.isArray(body.venueFeatures) ? body.venueFeatures : [],
      dates: Array.isArray(body.dates) ? body.dates : []
    };

    const created = db.insertOne('events', newEvent);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
