import { NextResponse } from 'next/server';
import { signToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials not configured in server environment variables.' },
        { status: 500 }
      );
    }

    const inputEmail = email.toLowerCase().trim();
    const targetEmail = adminEmail.toLowerCase().trim();

    if (inputEmail !== targetEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const adminUser = {
      id: 'super_admin_1',
      name: process.env.ADMIN_NAME || 'RaasVerse Super Admin',
      email: targetEmail,
      role: 'super_admin'
    };

    // Create secure session token
    const token = signToken(adminUser);

    const response = NextResponse.json({
      success: true,
      user: adminUser,
      token
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in /api/admin/login:', error);
    return NextResponse.json({ error: 'Login failed due to server error' }, { status: 500 });
  }
}
