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
      const promotion = await this.prisma.promotions.create({
        data: {
          ...dto,
          createdBy: userId,
        },
      });

      // Invalidate Redis cache when a new promotion is created
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
      const cachedPromotions = await this.redis.get(
        'promotion',
        'ACTIVE_PROMOTIONS',
      );
      if (cachedPromotions) {
        return {
          status: 200,
          message: 'Promotions retrieved successfully (from cache)',
          data: JSON.parse(cachedPromotions),
        };
      }

      const currentDate = new Date();
      const promotions = await this.prisma.promotions.findMany({
        where: {
          isActive: true,
          endDate: { gte: currentDate },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Cache the promotions for future requests
      promotions.length > 0 &&
        (await this.redis.set(
          'promotion',
          'ACTIVE_PROMOTIONS',
          JSON.stringify(promotions),
        ));

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
          createdAt: 'desc',
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
