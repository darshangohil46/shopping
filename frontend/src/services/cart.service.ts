import { clientApi } from "../lib/clientApi";
import {
  CartResponse,
  AddToCartRequest,
  UpdateQuantityRequest,
  CheckoutResponse,
} from "../types/cart.types";

export class CartService {
  private notifyCartChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart-updated"));
    }
  }

  async getCart(): Promise<CartResponse> {
    return clientApi.get<CartResponse>("/api/cart");
  }

  async addToCart(productId: string, quantity = 1): Promise<CartResponse> {
    const payload: AddToCartRequest = { productId, quantity };
    const response = await clientApi.post<CartResponse>("/api/cart", payload);
    this.notifyCartChange();
    return response;
  }

  async updateQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const payload: UpdateQuantityRequest = { quantity };
    const response = await clientApi.patch<CartResponse>(
      `/api/cart/item/${cartItemId}`,
      payload,
    );
    this.notifyCartChange();
    return response;
  }

  async removeItem(cartItemId: string): Promise<CartResponse> {
    const response = await clientApi.delete<CartResponse>(
      `/api/cart/item/${cartItemId}`,
    );
    this.notifyCartChange();
    return response;
  }

  async checkout(): Promise<CheckoutResponse> {
    const response =
      await clientApi.post<CheckoutResponse>("/api/cart/checkout");
    this.notifyCartChange();
    return response;
  }
}

export const cartService = new CartService();
