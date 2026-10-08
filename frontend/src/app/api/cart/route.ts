import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartApiService } from '../../../services-api/cart.api-service';
import { COOKIE_ACCESS_TOKEN } from '../../../utils/constant';
import { addToCartSchema } from '../../../schema/cart.schema';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to view cart' },
        { status: 401 },
      );
    }

    const data = await cartApiService.getCart(token);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to retrieve cart';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to add items to cart' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = addToCartSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg =
        validation.error.issues[0]?.message || 'Invalid input data';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = await cartApiService.addToCart(token, validation.data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to add item to cart';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
