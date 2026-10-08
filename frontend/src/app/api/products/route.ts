import { NextResponse } from 'next/server';
import { productsApiService } from '../../../services-api/products.api-service';

export async function GET() {
  try {
    const data = await productsApiService.getProducts();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
