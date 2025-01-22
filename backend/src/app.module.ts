import { Module } from '@nestjs/common';
import { AuthModule } from './apps/auth/auth.module';
import { ProductModule } from './apps/product/product.module';
import { PromotionModule } from './apps/promotion/promotion.module';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SharedModule } from './modules/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProductModule,
    PrismaModule,
    SharedModule,
    PromotionModule
  ],
  providers: [AuthModule,ProductModule,PrismaModule],
})
export class AppModule {}
