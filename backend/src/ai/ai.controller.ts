import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('bio')
  async generateBio(
    @Query('name') name: string,
    @Query('role') role: 'INFLUENCER' | 'BUSINESS',
    @Query('niche') niche: string,
    @Query('details') details: string,
  ) {
    return {
      bio: await this.aiService.generateBio({ name, role, niche, details })
    };
  }
}
