import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getUserOrders(userId: string) {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return {
      orders: orders.map((order) => {
        const grandTotal = Number(order.grandTotal);
        const items = (order.items || []).map((item) => {
          const unitPrice = Number(item.price);
          const lineTotal = unitPrice * item.quantity;
          return {
            id: item.id,
            productId: item.productId,
            name: item.product?.name || 'Product',
            imageUrl: item.product?.imageUrl || '',
            quantity: item.quantity,
            price: unitPrice,
            lineTotal,
          };
        });

        return {
          id: order.id,
          userId: order.userId,
          grandTotal,
          emailSent: order.emailSent,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items,
        };
      }),
    };
  }
}
