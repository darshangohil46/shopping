import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

export const SAMPLE_PRODUCTS: Array<Partial<Product>> = [
  {
    name: 'Wireless Mouse',
    description:
      'Smooth optical tracking with 2.4GHz wireless connection and ergonomic grip.',
    price: 499.0,
    imageUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'USB Keyboard',
    description:
      'Durable full-size keyboard with quiet low-profile keys and splash resistance.',
    price: 799.0,
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Laptop Stand',
    description:
      'Adjustable aluminum riser promoting healthy posture with cooling airflow.',
    price: 1200.0,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Noise Cancelling Headphones',
    description:
      'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery.',
    price: 2499.0,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ergonomic Desk Cushion',
    description:
      'High-density memory foam seat cushion for spine alignment and long hours.',
    price: 899.0,
    imageUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'USB-C Multiport Hub',
    description:
      '7-in-1 adapter with 4K HDMI, 3x USB 3.0, SD card reader, and 100W PD charging.',
    price: 1499.0,
    imageUrl:
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Full HD 1080p Webcam',
    description:
      'Crystal-clear video with integrated dual noise-reducing microphones.',
    price: 1899.0,
    imageUrl:
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mechanical Keyboard RGB',
    description:
      'Customizable mechanical switches with durable double-shot keycaps.',
    price: 2199.0,
    imageUrl:
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Portable External SSD 1TB',
    description:
      'Ultra-fast read and write speeds up to 1050MB/s in a rugged shock-proof body.',
    price: 5499.0,
    imageUrl:
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dimmable LED Desk Lamp',
    description:
      'Eye-caring touch-control desk lamp with 5 brightness levels and USB charging.',
    price: 699.0,
    imageUrl:
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&auto=format&fit=crop&q=80',
  },
];

@Injectable()
export class ProductsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    // Auto-seed if products table is empty
    const count = await this.productRepository.count();
    if (count === 0) {
      this.logger.log(
        'Products table is empty. Seeding 10 initial products...',
      );
      await this.seed();
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: { price: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async seed(): Promise<{ count: number; message: string }> {
    const existing = await this.productRepository.count();
    if (existing >= 10) {
      return {
        count: existing,
        message: 'Products already seeded.',
      };
    }

    // Insert only items that don't already exist by name
    let added = 0;
    for (const item of SAMPLE_PRODUCTS) {
      const exists = await this.productRepository.findOne({
        where: { name: item.name },
      });
      if (!exists) {
        const prod = this.productRepository.create(item);
        await this.productRepository.save(prod);
        added++;
      }
    }

    this.logger.log(`Seeded ${added} products into database.`);
    const total = await this.productRepository.count();
    return {
      count: total,
      message: `Seeded successfully. Total products: ${total}`,
    };
  }
}
