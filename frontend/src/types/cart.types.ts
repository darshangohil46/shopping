export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface CartResponse {
  items: CartItem[];
  grandTotal: number;
  totalItems: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface CheckoutResponse {
  message: string;
  order: {
    id: string;
    userId: string;
    grandTotal: number;
    createdAt: string;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    lineTotal: number;
  }>;
  emailSent: boolean;
}
