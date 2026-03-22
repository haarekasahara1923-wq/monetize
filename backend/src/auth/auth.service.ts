import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_123');
  }

  async signUp(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.passwordHash, salt);

    const verificationToken = Math.random().toString(36).substring(2, 15);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        role: dto.role,
        name: dto.name,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        city: dto.city,
        state: dto.state,
        bio: dto.bio,
        achievements: dto.achievements,
        businessName: dto.businessName,
        ownerName: dto.ownerName,
        address: dto.address,
        targetLocation: dto.targetLocation,
        verificationToken,
        platformStats: dto.role === 'INFLUENCER' && dto.platformStats ? {
          create: dto.platformStats.map(s => ({
            platform: s.platform,
            followers: s.followers,
            avgViews: s.avgViews,
            avgLikes: s.avgLikes,
            avgComments: s.avgComments,
          }))
        } : undefined
      }
    });

    // Send verification email via Resend
    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: user.email,
        subject: 'Verify your Monetize Connect Account',
        html: `<p>Click <a href="${process.env.NEXT_PUBLIC_API_URL}/auth/verify?token=${verificationToken}">here</a> to verify your email.</p>`
      });
    } catch(e) {
      console.log('Resend email failed', e);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null }
    });

    return { message: 'Email verified successfully' };
  }
}
