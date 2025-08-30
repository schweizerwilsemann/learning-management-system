import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createOrder(amount: number, courseId: string, userId: string) {
    try {
      // VNPay configuration
      const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      const vnpReturnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/callback';
      const vnpTmnCode = process.env.VNPAY_TMN_CODE;
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET;
      const vnpVersion = '2.1.0';
      const vnpCommand = 'pay';
      const vnpCurrCode = 'VND';
      const vnpLocale = 'vn';
      const vnpIpAddr = '127.0.0.1';
      const vnpTxnRef = Date.now().toString();
      const vnpOrderInfo = `Thanh toan khoa hoc ${courseId}`;
      const vnpOrderType = 'billpayment';
      const vnpAmount = amount * 100; // Convert to VND (smallest unit)

      // Create payment URL
      const date = new Date();
      const createDate = date.toISOString().split('T')[0].split('-').join('');

      const vnpParams = {
        vnp_Version: vnpVersion,
        vnp_Command: vnpCommand,
        vnp_TmnCode: vnpTmnCode,
        vnp_Amount: vnpAmount,
        vnp_CurrCode: vnpCurrCode,
        vnp_BankCode: '',
        vnp_TxnRef: vnpTxnRef,
        vnp_OrderInfo: vnpOrderInfo,
        vnp_OrderType: vnpOrderType,
        vnp_Locale: vnpLocale,
        vnp_ReturnUrl: vnpReturnUrl,
        vnp_IpAddr: vnpIpAddr,
        vnp_CreateDate: createDate,
      };

      // Sort parameters alphabetically
      const sortedParams = Object.keys(vnpParams)
        .sort()
        .reduce((result, key) => {
          result[key] = vnpParams[key];
          return result;
        }, {});

      // Create query string
      const queryString = Object.keys(sortedParams)
        .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
        .join('&');

      // Create signature
      const signData = queryString;
      const hmac = crypto.createHmac('sha512', vnpHashSecret);
      const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      const vnpSecureHash = signed;

      // Create payment URL
      const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${vnpSecureHash}`;

      // Store order in database
      const order = await this.prisma.payment.create({
        data: {
          id: vnpTxnRef,
          userId: userId,
          courseId: courseId,
          amountCents: amount * 100, // Convert to cents
          currency: 'VND',
          status: 'PENDING',
          provider: 'VNPAY' as any,
          raw: {
            vnpParams: vnpParams,
            paymentUrl: paymentUrl
          }
        }
      });

      return { 
        message: 'Order created successfully', 
        success: true, 
        order: {
          id: vnpTxnRef,
          amount: vnpAmount,
          currency: vnpCurrCode,
          paymentUrl: paymentUrl
        } 
      };
    } catch (error) {
      console.error('Error creating VNPay order:', error);
      return { success: false, message: 'Failed to create order' };
    }
  }

  async verifyPayment(body: any) {
    try {
      const { vnp_TxnRef, vnp_Amount, vnp_ResponseCode, vnp_SecureHash, vnp_OrderInfo } = body;
      
      // Verify signature
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET;
      const queryString = Object.keys(body)
        .filter(key => key !== 'vnp_SecureHash')
        .sort()
        .map(key => `${key}=${encodeURIComponent(body[key])}`)
        .join('&');

      const hmac = crypto.createHmac('sha512', vnpHashSecret);
      const signed = hmac.update(new Buffer(queryString, 'utf-8')).digest('hex');
      
      if (signed !== vnp_SecureHash) {
        return { success: false, message: 'Invalid signature' };
      }

      // Check response code (00 = success)
      if (vnp_ResponseCode !== '00') {
        return { success: false, message: 'Payment failed' };
      }

      // Get payment from database
      const payment = await this.prisma.payment.findUnique({
        where: { id: vnp_TxnRef }
      });

      if (!payment) {
        return { success: false, message: 'Payment not found' };
      }

      if (payment.status === 'SUCCEEDED') {
        return { success: true, message: 'Payment already processed' };
      }

      // Update payment status
      await this.prisma.payment.update({
        where: { id: vnp_TxnRef },
        data: { status: 'SUCCEEDED' }
      });

      // Create purchase record
      const course = await this.prisma.course.findUnique({ 
        where: { id: payment.courseId } 
      });

      const purchase = await this.prisma.purchase.create({ 
        data: { 
          userId: payment.userId, 
          courseId: payment.courseId, 
          price: course ? Math.round((course.priceCents ?? 0) / 100) : 0 
        } 
      });

      return { 
        message: 'Course purchased successfully.', 
        success: true, 
        purchase 
      };
    } catch (error) {
      console.error('Error verifying VNPay payment:', error);
      return { success: false, message: 'Payment verification failed' };
    }
  }
}
