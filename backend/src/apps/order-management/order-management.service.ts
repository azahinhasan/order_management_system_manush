import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreateOrderDto, OrderItemDto, UpdateOrderDto } from './order-management.dto';
import { PaginationDto } from '../../lib/dtos/pagination.dto';

@Injectable()
export class OrderManagementService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  // Create a new order
  async createOrder(dto: OrderItemDto[],userId: number) {
    try {
      const order = await this.prisma.orders.create({
        data: {
          userId,
          items: {
            create: dto,
          },
        },
        include: { items: true },
      });


      await this.actionLogger.logAction(
        {
          referenceId: order.id,
          refereceType: 'ORDER_MANAGEMENT',
          action: 'CREATE',
          context: 'Order Service - createOrder',
          description: `Order ${order.id} created`,
          additionalInfo: null,
        },
        userId
      );

      return {
        status: 201,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating the order',
        errorStack: error,
        context: 'OrderService - createOrder',
      });
    }
  }

  async getOrders(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const orders = await this.prisma.orders.findMany({
        include: { items: {
          include: { product: true },
        }, user: true, },
        skip,
        take: limit,
      });

      const totalCount = await this.prisma.orders.count();

      return {
        status: 200,
        message: 'Orders retrieved successfully',
        page,
        limit,
        totalCount,
        orders,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving orders',
        errorStack: error,
        context: 'OrderService - getOrdersByUser',
      });
    }
  }

  async getOrdersByUser(userId: number) {
    try {

      const orders = await this.prisma.orders.findMany({
        where: { userId },
        include: { items: true },
      });

      return {
        status: 200,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving orders',
        errorStack: error,
        context: 'OrderService - getOrdersByUser',
      });
    }
  }

  async getOrderById(orderId: number) {
    try {
      const order = await this.prisma.orders.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        return {
          status: 404,
          message: 'Order not found',
        };
      }

      return {
        status: 200,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving the order',
        errorStack: error,
        context: 'OrderService - getOrderById',
      });
    }
  }

  async updateOrder(dto: UpdateOrderDto,orderId: number) {
    console.log(dto,'dto')
    try {
      const updatedOrder = await this.prisma.orders.update({
        where: { id: orderId },
        data: {
          ...dto,
          updatedAt: new Date(),
        },
        include: { items: true },
      });

      await this.actionLogger.logAction(
        {
          referenceId: updatedOrder.id,
          refereceType: 'ORDER_MANAGEMENT',
          action: 'UPDATE',
          context: 'Order Service - updateOrder',
          description: `Order ${updatedOrder.id} updated`,
          additionalInfo: null,
        },
        dto.orderId,
      );

      return {
        status: 200,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating the order',
        errorStack: error,
        context: 'OrderService - updateOrder',
      });
    }
  }

  async deleteOrder(orderId: number, userId: number) {
    try {
      await this.prisma.orders.delete({ where: { id: orderId } });

      await this.actionLogger.logAction(
        {
          referenceId: orderId,
          refereceType: 'ORDER_MANAGEMENT',
          action: 'DELETE',
          context: 'Order Service - deleteOrder',
          description: `Order ${orderId} deleted`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting the order',
        errorStack: error,
        context: 'OrderService - deleteOrder',
      });
    }
  }
}
