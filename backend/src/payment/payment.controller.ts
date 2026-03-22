import { Controller, Post, Body, UseGuards, Request, Headers, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentOrderDto, RazorpayWebhookDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS)
  @Post('create-order')
  async createOrder(@Body() dto: CreatePaymentOrderDto) {
    return this.paymentService.createOrder(dto.dealId);
  }

  @Post('webhook')
  async handleWebhook(@Headers('x-razorpay-signature') signature: string, @Body() body: any) {
    if (!signature) {
      throw new BadRequestException('Signature missing');
    }
    return this.paymentService.handleWebhook(body, signature);
  }

  // Admin/Auto Release trigger when deal is marked COMPLETED
  @Post('release-funds')
  @UseGuards(JwtAuthGuard)
  async releaseFunds(@Body('dealId') dealId: string) {
    return this.paymentService.releaseFunds(dealId);
  }
}
