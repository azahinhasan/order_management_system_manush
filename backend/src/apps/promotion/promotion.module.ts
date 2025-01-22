import { Module } from '@nestjs/common';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { RedisModule } from 'src/modules/redis/redis.module';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService],
  imports: [RedisModule],
})
export class PromotionModule {}
