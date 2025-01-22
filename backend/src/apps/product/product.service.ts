import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { PaginationDto } from '../../lib/dtos/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  async createProduct(dto: CreateProductDto, userId: number) {
    try {
      const product = await this.prisma.products.create({
        data: {
          ...dto,
          createdBy: userId,
        },
      });

      await this.actionLogger.logAction(
        {
          referenceId: product.id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'CREATE',
          context: 'Product Service - createProduct',
          description: `Product ${product.name} created`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 201,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating the product',
        errorStack: error,
        context: 'ProductService - createProduct',
      });
    }
  }

  async getProducts(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const products = await this.prisma.products.findMany({
        where: { isActive: true },
        skip,
        take: limit,
      });

      return {
        status: 200,
        message: 'Products retrieved successfully',
        page,
        limit,
        data: products
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving products',
        errorStack: error,
        context: 'ProductService - getProducts',
      });
    }
  }
  async getProductById(productId: number) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return {
          status: 404,
          message: 'Product not found',
        };
      }

      return {
        status: 200,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving the product',
        errorStack: error,
        context: 'ProductService - getProductById',
      });
    }
  }

  async updateProduct(productId: number, dto: UpdateProductDto, userId: number) {
    try {
      const product = await this.prisma.products.update({
        where: { id: productId },
        data: {
          ...dto,
          updatedAt: new Date(),
        },
      });

      await this.actionLogger.logAction(
        {
          referenceId: product.id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'UPDATE',
          context: 'Product Service - updateProduct',
          description: `Product ${product.name} updated`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating the product',
        errorStack: error,
        context: 'ProductService - updateProduct',
      });
    }
  }

  async deleteProduct(productId: number, userId: number) {
    try {
      const product = await this.prisma.products.delete({
        where: { id: productId },
      });

      await this.actionLogger.logAction(
        {
          referenceId: product.id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'DELETE',
          context: 'Product Service - deleteProduct',
          description: `Product ${product.name} deleted`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting the product',
        errorStack: error,
        context: 'ProductService - deleteProduct',
      });
    }
  }
}
