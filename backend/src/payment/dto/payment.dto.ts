import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsString()
  @IsNotEmpty()
  dealId: string;
}

export class RazorpayWebhookDto {
  event: string;
  payload: any;
}
