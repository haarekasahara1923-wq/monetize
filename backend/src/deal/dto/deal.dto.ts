import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';
import { DealStatus } from '@prisma/client';

export class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  campaignId?: string;

  @IsString()
  @IsNotEmpty()
  influencerId: string;

  @IsNumber()
  @Min(0)
  proposedPrice: number;
}

export class UpdateDealStatusDto {
  @IsEnum(['NEGOTIATING', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'DISPUTED', 'CANCELLED'])
  status: DealStatus;

  @IsOptional()
  @IsNumber()
  finalPrice?: number;
}
