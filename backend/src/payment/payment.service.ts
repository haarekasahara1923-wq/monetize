import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
const Razorpay = require('razorpay');
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_invalid',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'invalid_secret',
    });
  }

  async createOrder(dealId: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) throw new NotFoundException('Deal not found');
    if (!deal.finalPrice) throw new BadRequestException('Deal has no final price agreed');

    const order = await this.razorpay.orders.create({
      amount: Math.round(deal.finalPrice * 100), // in paise
      currency: 'INR',
      receipt: `receipt_${deal.id}`,
    });

    await this.prisma.deal.update({
      where: { id: deal.id },
      data: { razorpayOrderId: order.id },
    });

    return order;
  }

  async handleWebhook(body: any, signature: string) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook-secret';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid signature');
    }

    if (body.event === 'payment.captured' || body.event === 'order.paid') {
      const orderId = body.payload.order?.entity?.id || body.payload.payment.entity.order_id;
      const paymentId = body.payload.payment.entity.id;
      
      await this.prisma.deal.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          paymentStatus: 'HELD',
          razorpayPaymentId: paymentId,
        },
      });
      
      // Update deal status to ACTIVE if it was ACCEPTED
      const deal = await this.prisma.deal.findFirst({
        where: { razorpayOrderId: orderId }
      });
      
      if(deal && deal.status === 'ACCEPTED') {
          await this.prisma.deal.update({
              where: { id: deal.id },
              data: { status: 'ACTIVE' }
          });
      }
    }

    return { status: 'ok' };
  }

  async releaseFunds(dealId: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
      include: { influencer: true }
    });

    if (!deal) throw new NotFoundException('Deal not found');
    if (deal.paymentStatus !== 'HELD') throw new BadRequestException('Payment not in HELD status');
    if (deal.status !== 'COMPLETED') throw new BadRequestException('Deal not completed yet');

    // Commission logic
    const commissionRate = 0.10; // 10%
    const finalPrice = deal.finalPrice || 0;
    const payoutAmount = finalPrice * (1 - commissionRate);

    // In a production environment, you'd use Razorpay Payouts/Route here
    // For now, we logically release the funds
    await this.prisma.deal.update({
      where: { id: deal.id },
      data: { paymentStatus: 'RELEASED' },
    });

    return { message: 'Funds released to influencer logically', payoutAmount };
  }
}
