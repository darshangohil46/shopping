import { serverApi } from '../lib/serverApi';
import { UserOrdersResponse } from '../types/order.types';

export class OrdersApiService {
  async getUserOrders(token: string): Promise<UserOrdersResponse> {
    return serverApi.get<UserOrdersResponse>('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const ordersApiService = new OrdersApiService();
