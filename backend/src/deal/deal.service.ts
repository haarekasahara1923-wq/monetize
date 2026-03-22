import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto, UpdateDealStatusDto } from './dto/deal.dto';
import { DealStatus } from '@prisma/client';
import { AiService } from '../ai/ai.service';

@Injectable()
export class DealService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService
  ) {}

  async create(businessId: string, dto: CreateDealDto) {
    return this.prisma.deal.create({
      data: {
        ...dto,
        businessId,
        status: DealStatus.SUGGESTED,
      },
    });
  }

  async generateAiContract(id: string, userId: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        business: true,
        influencer: true,
        campaign: true,
      },
    });

    if (!deal) throw new NotFoundException('Deal not found');
    if (deal.businessId !== userId) throw new ForbiddenException('Only the business can generate a contract');

    const contract = await this.aiService.generateContract({
      brandName: deal.business.businessName || deal.business.name,
      influencerName: deal.influencer.name,
      platform: deal.campaign?.platform || 'Social Media',
      amount: deal.finalPrice || deal.proposedPrice,
      deliverables: deal.campaign?.description || 'Promotional content creation and posting.',
    });

    return this.prisma.deal.update({
      where: { id },
      data: { contractUrl: contract }, // Using contractUrl field to store the text for now
    });
  }

  async updateStatus(id: string, userId: string, dto: UpdateDealStatusDto) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) throw new NotFoundException('Deal not found');
    
    // Authorization: Only parties involved can update the deal
    if (deal.businessId !== userId && deal.influencerId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.deal.update({
      where: { id },
      data: {
        status: dto.status,
        finalPrice: dto.finalPrice ?? deal.finalPrice,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.deal.findMany({
      where: {
        OR: [{ businessId: userId }, { influencerId: userId }],
      },
      include: {
        business: true,
        influencer: true,
        campaign: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.deal.findUnique({
      where: { id },
      include: {
        business: true,
        influencer: true,
        campaign: true,
      },
    });
  }
}
