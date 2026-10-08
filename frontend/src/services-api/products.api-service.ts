import { serverApi } from '../lib/serverApi';
import { Product, ProductsResponse } from '../types/product.types';

export class ProductsApiService {
  async getProducts(): Promise<ProductsResponse> {
    return serverApi.get<ProductsResponse>('/products');
  }

  async getProductById(id: string): Promise<{ product: Product }> {
    return serverApi.get<{ product: Product }>(`/products/${id}`);
  }
}

export const productsApiService = new ProductsApiService();
