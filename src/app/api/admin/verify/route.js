import { NextResponse } from 'next/server';
import { verifySuperAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await verifySuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user: admin });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
  }
}
