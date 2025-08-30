import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('order')
  async createOrder(@Body() body: { amount: number; courseId: string; userId: string }) {
    return this.checkoutService.createOrder(body.amount, body.courseId, body.userId);
  }

  @Post('verify')
  async verifyPayment(@Body() body: any) {
    return this.checkoutService.verifyPayment(body);
  }
}
