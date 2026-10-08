import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authApiService } from '../../../../services-api/auth.api-service';
import { signupSchema } from '../../../../schema/auth.schema';
import { COOKIE_ACCESS_TOKEN } from '../../../../utils/constant';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validation = signupSchema.safeParse(rawBody);

    if (!validation.success) {
      const firstError =
        validation.error.issues[0]?.message || 'Invalid input data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const result = await authApiService.signup(validation.data);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_ACCESS_TOKEN, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600, // 1 hour
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
