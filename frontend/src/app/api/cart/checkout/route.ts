import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartApiService } from '../../../../services-api/cart.api-service';
import { COOKIE_ACCESS_TOKEN } from '../../../../utils/constant';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to checkout' },
        { status: 401 },
      );
    }

    const data = await cartApiService.checkout(token);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
