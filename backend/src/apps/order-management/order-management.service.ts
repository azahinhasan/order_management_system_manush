import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreateOrderDto, UpdateOrderDto } from './order-management.dto';
import { PaginationDto } from '../../lib/dtos/pagination.dto';

@Injectable()
export class OrderManagementService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  // Create a new order
  async createOrder(dto: CreateOrderDto) {
    try {
      const order = await this.prisma.orders.create({
        data: {
          userId: dto.userId,
          totalDiscount: 0,
          grandTotal: 0,
          items: {
            create: dto.items.map(item => ({
              productId: item.productId,
              orderQuantity: item.orderQuantity,
              unitPrice: 0, 
              discount: 0,
              totalPrice: 0,
            })),
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
        dto.userId
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
        include: { items: true },
        skip,
        take: limit,
      });

      return {
        status: 200,
        message: 'Orders retrieved successfully',
        page,
        limit,
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

  async updateOrder(dto: UpdateOrderDto) {
    try {
      const updatedOrder = await this.prisma.orders.update({
        where: { id: dto.orderId },
        data: {
          items: {
            deleteMany: {},
            create: dto.items.map(item => ({
              productId: item.productId,
              orderQuantity: item.orderQuantity,
              unitPrice: 0, 
              discount: 0,
              totalPrice: 0,
            })),
          },
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
