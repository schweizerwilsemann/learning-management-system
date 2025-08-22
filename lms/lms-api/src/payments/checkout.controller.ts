import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('order')
  async createOrder(@Body() body: { amount: number }) {
    return this.checkoutService.createOrder(body.amount);
  }

  @Post('verify')
  async verifyPayment(@Body() body: any) {
    return this.checkoutService.verifyPayment(body);
  }
}
