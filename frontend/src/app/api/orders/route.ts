import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ordersApiService } from '../../../services-api/orders.api-service';
import { COOKIE_ACCESS_TOKEN } from '../../../utils/constant';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to view orders' },
        { status: 401 },
      );
    }

    const data = await ordersApiService.getUserOrders(token);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
