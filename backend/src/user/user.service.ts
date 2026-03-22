import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findInfluencers(filters: { platform?: string; minFollowers?: number; city?: string }) {
    return this.prisma.user.findMany({
      where: {
        role: Role.INFLUENCER,
        platformStats: {
          some: {
            platform: filters.platform,
            followers: { gte: filters.minFollowers ?? 0 },
          },
        },
        city: filters.city ? { contains: filters.city, mode: 'insensitive' } : undefined,
      },
      include: {
        platformStats: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        platformStats: true,
      },
    });
  }
}
