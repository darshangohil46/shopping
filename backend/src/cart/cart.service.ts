import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

export interface CartResponseItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface CartResponse {
  items: CartResponseItem[];
  grandTotal: number;
  totalItems: number;
}

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async getCart(userId: string): Promise<CartResponse> {
    const rawItems = await this.cartRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'ASC' },
    });

    const items: CartResponseItem[] = rawItems
      .filter((item) => Boolean(item.product))
      .map((item) => {
        const unitPrice = Number(item.product.price);
        const lineTotal = unitPrice * item.quantity;
        return {
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          price: unitPrice,
          quantity: item.quantity,
          lineTotal,
          imageUrl: item.product.imageUrl,
        };
      });

    const grandTotal = items.reduce((acc, item) => acc + item.lineTotal, 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items,
      grandTotal,
      totalItems,
    };
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity = 1,
  ): Promise<CartResponse> {
    if (quantity < 1) {
      throw new BadRequestException('Invalid quantity: must be at least 1');
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existing = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (existing) {
      existing.quantity += quantity;
      await this.cartRepository.save(existing);
    } else {
      const newItem = this.cartRepository.create({
        userId,
        productId,
        quantity,
      });
      await this.cartRepository.save(newItem);
    }

    return this.getCart(userId);
  }

  async updateQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const item = await this.cartRepository.findOne({
      where: { id: cartItemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.cartRepository.remove(item);
    } else {
      item.quantity = quantity;
      await this.cartRepository.save(item);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, cartItemId: string): Promise<CartResponse> {
    const item = await this.cartRepository.findOne({
      where: { id: cartItemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(item);
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  async checkout(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User account not found');
    }

    const cart = await this.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException(
        'Empty cart: please add products before placing an order',
      );
    }

    // 1. Create single order header for user with grandTotal
    const order = this.orderRepository.create({
      userId: user.id,
      grandTotal: cart.grandTotal,
      emailSent: false,
    });
    const savedOrder = await this.orderRepository.save(order);

    // 2. Save each ordered item into order_items
    const orderedItemsSummary = [];
    for (const item of cart.items) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
      const savedItem = await this.orderItemRepository.save(orderItem);

      orderedItemsSummary.push({
        id: savedItem.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        lineTotal: item.lineTotal,
      });
    }

    // 3. Clear the user's cart in database
    await this.clearCart(userId);

    // 4. Send email with order summary (handling any email failure gracefully without crashing)
    const emailResult = await this.mailService.sendOrderSummary(
      user.email,
      user.name,
      cart.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        lineTotal: i.lineTotal,
      })),
      cart.grandTotal,
    );

    if (emailResult.success) {
      savedOrder.emailSent = true;
      await this.orderRepository.save(savedOrder);
    }

    return {
      message:
        'Order placed successfully! A receipt has been sent to your email.',
      order: {
        id: savedOrder.id,
        userId: savedOrder.userId,
        grandTotal: savedOrder.grandTotal,
        createdAt: savedOrder.createdAt,
      },
      items: orderedItemsSummary,
      emailSent: emailResult.success,
    };
  }
}
