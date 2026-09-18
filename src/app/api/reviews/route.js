import { NextResponse } from 'next/server';
import { db } from '@/lib/nosql';
import { TESTIMONIALS } from '@/constants/testimonials';

// GET /api/reviews - Get all verified reviews
export async function GET() {
  try {
    const dbReviews = db.find('reviews') || [];
    // Combine db reviews (newest first) with base testimonials
    const allReviews = [...dbReviews].reverse().concat(TESTIMONIALS);

    return NextResponse.json({
      success: true,
      reviews: allReviews,
      total: allReviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request) {
  try {
    const body = await request.json();

    const { name, rating, text, city, eventTitle } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    const ratingNum = Math.min(5, Math.max(1, Number(rating) || 5));

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Please share your feedback or experience.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const avatar = cleanName.charAt(0).toUpperCase() || 'R';

    const newReview = {
      name: cleanName,
      city: city?.trim() || 'Ahmedabad',
      eventTitle: eventTitle?.trim() || 'Navratri Garba',
      avatar,
      rating: ratingNum,
      text: text.trim(),
      verified: true,
      createdAt: new Date().toISOString()
    };

    const created = db.insertOne('reviews', newReview);

    return NextResponse.json({
      success: true,
      review: created,
      message: 'Review submitted successfully! Thank you for sharing your experience.'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
