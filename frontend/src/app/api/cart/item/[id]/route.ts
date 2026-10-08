import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartApiService } from '../../../../../services-api/cart.api-service';
import { COOKIE_ACCESS_TOKEN } from '../../../../../utils/constant';
import { updateQuantitySchema } from '../../../../../schema/cart.schema';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const validation = updateQuantitySchema.safeParse(body);

    if (!validation.success) {
      const errorMsg =
        validation.error.issues[0]?.message || 'Invalid input data';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = await cartApiService.updateQuantity(
      token,
      id,
      validation.data,
    );
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to update item quantity';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const data = await cartApiService.removeItem(token, id);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to remove item from cart';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
