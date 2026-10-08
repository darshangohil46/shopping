import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  async addToCart(@GetUser('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(userId, dto.productId, dto.quantity ?? 1);
  }

  @Patch('item/:id')
  async updateQuantity(
    @GetUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() dto: UpdateQuantityDto,
  ) {
    return this.cartService.updateQuantity(userId, itemId, dto.quantity);
  }

  @Delete('item/:id')
  async removeItem(@GetUser('id') userId: string, @Param('id') itemId: string) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async checkout(@GetUser('id') userId: string) {
    return this.cartService.checkout(userId);
  }
}
