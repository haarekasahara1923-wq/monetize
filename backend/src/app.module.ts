import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { CampaignModule } from './campaign/campaign.module';
import { DealModule } from './deal/deal.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { CommonModule } from './common/common.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CampaignModule,
    DealModule,
    UserModule,
    PaymentModule,
    CommonModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
