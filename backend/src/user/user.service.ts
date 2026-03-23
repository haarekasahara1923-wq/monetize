import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findInfluencers(filters: { platform?: string; minFollowers?: number; city?: string }) {
    const where: any = {
      role: Role.INFLUENCER,
    };

    // Only filter by platformStats when platform or minFollowers is explicitly provided
    if (filters.platform || filters.minFollowers) {
      where.platformStats = {
        some: {
          ...(filters.platform ? { platform: filters.platform } : {}),
          ...(filters.minFollowers ? { followers: { gte: filters.minFollowers } } : {}),
        },
      };
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    return this.prisma.user.findMany({
      where,
      include: {
        platformStats: true,
      },
    });
  }

  async findBusinesses() {
    return this.prisma.user.findMany({
      where: { role: Role.BUSINESS },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { platformStats: true }
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

  async update(id: string, data: any) {
    const { platformStats, ...rest } = data;

    // Handle platform stats update if provided
    if (platformStats && Array.isArray(platformStats)) {
      // Simple approach: delete all and recreate
      await this.prisma.platformStats.deleteMany({
        where: { userId: id }
      });

      await this.prisma.platformStats.createMany({
        data: platformStats.map((stat: any) => ({
          userId: id,
          platform: stat.platform,
          followers: parseInt(stat.followers) || 0,
          avgViews: parseInt(stat.avgViews) || 0,
          avgLikes: parseInt(stat.avgLikes) || 0,
          avgComments: parseInt(stat.avgComments) || 0,
        }))
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: rest,
      include: { platformStats: true }
    });
  }
}
