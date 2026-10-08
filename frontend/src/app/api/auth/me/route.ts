import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authApiService } from '../../../../services-api/auth.api-service';
import { COOKIE_ACCESS_TOKEN } from '../../../../utils/constant';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No active session' },
        { status: 401 },
      );
    }

    const result = await authApiService.getProfile(token);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
