import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_ACCESS_TOKEN } from '../../../../utils/constant';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_ACCESS_TOKEN);

  return NextResponse.json({ message: 'Logged out successfully' });
}
