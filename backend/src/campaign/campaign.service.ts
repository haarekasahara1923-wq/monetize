import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...dto,
        businessId: userId,
      },
    });
  }

  async findAll(filters: any) {
    // For now basic list, can add specialized filters for platform, budget, location
    return this.prisma.campaign.findMany({
      include: {
        business: {
          select: {
            name: true,
            businessName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        business: true,
        deals: true,
      },
    });
  }
}
