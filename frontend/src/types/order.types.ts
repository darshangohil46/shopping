export interface OrderItemDetail {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface OrderDetail {
  id: string;
  userId: string;
  grandTotal: number;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetail[];
}

export interface UserOrdersResponse {
  orders: OrderDetail[];
}
