import { serverApi } from '../lib/serverApi';
import {
  CartResponse,
  AddToCartRequest,
  UpdateQuantityRequest,
  CheckoutResponse,
} from '../types/cart.types';

export class CartApiService {
  async getCart(token: string): Promise<CartResponse> {
    return serverApi.get<CartResponse>('/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async addToCart(
    token: string,
    data: AddToCartRequest,
  ): Promise<CartResponse> {
    return serverApi.post<CartResponse>('/cart/add', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateQuantity(
    token: string,
    cartItemId: string,
    data: UpdateQuantityRequest,
  ): Promise<CartResponse> {
    return serverApi.patch<CartResponse>(`/cart/item/${cartItemId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async removeItem(token: string, cartItemId: string): Promise<CartResponse> {
    return serverApi.delete<CartResponse>(`/cart/item/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async checkout(token: string): Promise<CheckoutResponse> {
    return serverApi.post<CheckoutResponse>('/cart/checkout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const cartApiService = new CartApiService();
