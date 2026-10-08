import { clientApi } from '../lib/clientApi';
import { ProductsResponse } from '../types/product.types';

export class ProductsService {
  async getProducts(): Promise<ProductsResponse> {
    return clientApi.get<ProductsResponse>('/api/products');
  }
}

export const productsService = new ProductsService();
