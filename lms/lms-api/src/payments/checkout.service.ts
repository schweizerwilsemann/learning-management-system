import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

let instence: any = null;
try {
  // require to avoid ESM/CJS interop issues at runtime
  // and to prevent module-load failures when the package isn't available
  // prefer explicit env var RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET, fall back to NEXT_PUBLIC_*
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Razorpay = require('razorpay');
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;
  if (Razorpay && key_id && key_secret) {
    instence = new Razorpay({ key_id, key_secret });
  } else {
    instence = null;
  }
} catch (err) {
  // don't crash the app if razorpay package isn't present or fails to initialize
  instence = null;
}

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createOrder(amount: number) {
    if (!instence) {
      return { success: false, message: 'Payment provider not configured' };
    }
    const order = await instence.orders.create({ amount: amount * 100, currency: 'INR' });
    return { message: 'Order created successfully', success: true, order };
  }

  async verifyPayment(body: any) {
    if (!instence) {
      return { success: false, message: 'Payment provider not configured' };
    }
    const { paymentId, orderId, signature, courseId } = body;
    // simple HMAC verification
    const crypto = await import('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;
    if (!secret) return { message: 'Payment provider secret not configured', success: false };
    const hmac = crypto.createHmac('sha256', secret as string);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    if (generatedSignature !== signature) return { message: 'Payment verification failed.', success: false };
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    const purchase = await this.prisma.purchase.create({ data: { userId: '', courseId, price: course ? Math.round((course.priceCents ?? 0) / 100) : 0 } });
    return { message: 'Course purchased successfully.', success: true, purchase };
  }
}
