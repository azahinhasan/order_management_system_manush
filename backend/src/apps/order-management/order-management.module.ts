import { Module } from '@nestjs/common';
import { OrderManagementController } from './order-management.controller';
import { OrderManagementService } from './order-management.service';
import { RedisModule } from 'src/modules/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [OrderManagementController],
  providers: [OrderManagementService]
})
export class OrderManagementModule {}
