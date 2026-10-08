import { clientApi } from '../lib/clientApi';
import { UserOrdersResponse } from '../types/order.types';

export class OrdersService {
  async getUserOrders(): Promise<UserOrdersResponse> {
    return clientApi.get<UserOrdersResponse>('/api/orders');
  }
}

export const ordersService = new OrdersService();
