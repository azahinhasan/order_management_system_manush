import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreatePromotionDto, UpdatePromotionDto } from './promotion.dto';
import { PaginationDto } from 'src/lib/dtos/pagination.dto';

@Injectable()
export class PromotionService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  // Create a new promotion
  async createPromotion(dto: CreatePromotionDto, userId: number) {
    try {
      if (dto.type === 'WEIGHTED') {
        const currentDate = new Date();
        const overlappingPromotion = await this.prisma.promotions.findFirst({
          where: {
            type: 'WEIGHTED',
            unit: dto.unit,
            endDate: { gte: currentDate },
            AND: [
              {
                OR: [
                  {
                    minimumRange: { lte: dto.maximumRange },
                    maximumRange: { gte: dto.minimumRange },
                  },
                ],
              },
            ],
          },
        });
        if (overlappingPromotion) {
          return await this.errorLogger.errorlogger({
            errorMessage: `A promotion already exists within the range ${overlappingPromotion.minimumRange} to ${overlappingPromotion.maximumRange}. Please choose a different range.`,
            errorStack: ``,
            context: 'PromotionService - createPromotion',
          });
        }
      }

      const promotion = await this.prisma.promotions.create({
        data: {
          ...dto,
          createdBy: userId,
        },
      });

      await this.redis.delete('promotion', 'ACTIVE_PROMOTIONS');

      await this.actionLogger.logAction(
        {
          referenceId: promotion.id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'CREATE',
          context: 'Promotion Service - createPromotion',
          description: `Promotion ${promotion.title} created`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 201,
        message: 'Promotion created successfully',
        data: promotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating the promotion',
        errorStack: error,
        context: 'PromotionService - createPromotion',
      });
    }
  }

  async getAvailablePromotions() {
    try {
      await this.redis.delete('promotion', 'ACTIVE_PROMOTIONS');

      const cachedPromotions = await this.redis.get(
        'promotion',
        'ACTIVE_PROMOTIONS',
      );
      if (cachedPromotions) {
        return {
          status: 200,
          message: 'Promotions retrieved successfully (from cache)',
          promotions: JSON.parse(cachedPromotions),
        };
      }

      const currentDate = new Date();
      const promotions = await this.prisma.promotions.findMany({
        where: {
          isActive: true,
          endDate: { gte: currentDate },
        },
        orderBy: {
          id: 'desc',
        },
      });

      if (promotions.length > 0) {
        // Set the cache to expire at 11:59 PM
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(23, 59, 59, 999);
        const secondsUntilMidnight = Math.floor(
          (midnight.getTime() - now.getTime()) / 1000,
        );

        await this.redis.set(
          'promotion',
          'ACTIVE_PROMOTIONS',
          JSON.stringify(promotions),
          secondsUntilMidnight,
        );
      }

      return {
        status: 200,
        message: 'Promotions retrieved successfully',
        promotions,
      };
    } catch (error) {
      // Log the error
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving promotions',
        errorStack: error,
        context: 'PromotionService - getPromotions',
      });
    }
  }

  async getPromotions(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const promotions = await this.prisma.promotions.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      });

      const totalCount = await this.prisma.promotions.count({});

      return {
        status: 200,
        message: 'Promotions retrieved successfully',
        page,
        limit,
        totalCount,
        promotions,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving promotions',
        errorStack: error,
        context: 'PromotionService - getPromotions',
      });
    }
  }

  async getPromotionById(promotionId: number) {
    try {
      const promotion = await this.prisma.promotions.findUnique({
        where: { id: promotionId },
      });

      if (!promotion) {
        return {
          status: 404,
          message: 'Promotion not found',
        };
      }

      return {
        status: 200,
        message: 'Promotion retrieved successfully',
        data: promotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving the promotion',
        errorStack: error,
        context: 'PromotionService - getPromotionById',
      });
    }
  }

  async updatePromotion(
    promotionId: number,
    dto: UpdatePromotionDto,
    userId: number,
  ) {
    try {
      const updatedPromotion = await this.prisma.promotions.update({
        where: { id: promotionId },
        data: {
          ...dto,
          updatedAt: new Date(),
        },
      });

      // Invalidate Redis cache after update
      await this.redis.delete('promotion', 'ACTIVE_PROMOTIONS');

      await this.actionLogger.logAction(
        {
          referenceId: updatedPromotion.id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'UPDATE',
          context: 'Promotion Service - updatePromotion',
          description: `Promotion ${updatedPromotion.title} updated`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Promotion updated successfully',
        data: updatedPromotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating the promotion',
        errorStack: error,
        context: 'PromotionService - updatePromotion',
      });
    }
  }

  async deletePromotion(promotionId: number, userId: number) {
    try {
      const promotion = await this.prisma.promotions.delete({
        where: { id: promotionId },
      });

      // Invalidate Redis cache after delete
      await this.redis.delete('promotion', 'ACTIVE_PROMOTIONS');

      await this.actionLogger.logAction(
        {
          referenceId: promotion.id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'DELETE',
          context: 'Promotion Service - deletePromotion',
          description: `Promotion ${promotion.title} deleted`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Promotion deleted successfully',
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting the promotion',
        errorStack: error,
        context: 'PromotionService - deletePromotion',
      });
    }
  }
}
