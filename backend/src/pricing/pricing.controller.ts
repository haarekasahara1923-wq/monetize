import { Controller, Get, Query } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('calculate')
  async calculate(
    @Query('followers') followers: string,
    @Query('avgViews') avgViews: string,
    @Query('avgLikes') avgLikes: string,
    @Query('avgComments') avgComments: string,
    @Query('platform') platform: string,
    @Query('niche') niche: string,
  ) {
    return this.pricingService.calculatePrice({
      followers: parseInt(followers) || 0,
      avgViews: parseInt(avgViews) || 0,
      avgLikes: parseInt(avgLikes) || 0,
      avgComments: parseInt(avgComments) || 0,
      platform: platform || 'Instagram',
      niche: niche || 'General',
    });
  }
}
