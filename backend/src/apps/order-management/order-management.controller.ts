import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderManagementService } from './order-management.service';
import { GetIssuer } from 'src/decorators';
import {
  CreateOrderDto,
  OrderItemDto,
  UpdateOrderDto,
} from './order-management.dto';
import { Response } from 'express';
import { Users } from '@prisma/client';
import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';
import { PaginationDto } from '../../lib/dtos/pagination.dto';

const allowedRolesMutation = [
  { role: 'MANAGER', context: 'MT' },
  { role: 'ADMIN', context: 'MT' },
  { role: 'DEVELOPER', context: 'MT' },
];

@Controller('order')
@UseGuards(AuthGuard, RolesGuard)
@Roles({ role: 'SUPER_ADMIN', context: 'MT' })
export class OrderManagementController {
  constructor(private orderService: OrderManagementService) {}

  @Post()
  @Roles(...allowedRolesMutation)
  async createOrder(
    @Body() dto: OrderItemDto[],
    @GetIssuer() issuer: any,
    @Res() res: Response,
  ) {
    const result = await this.orderService.createOrder(dto, issuer.user.id);
    return res.status(result.status).json(result);
  }

  @Get('list')
  @Roles(...allowedRolesMutation)
  async getOrders(@Query() pagination: PaginationDto, @Res() res: Response) {
    const result = await this.orderService.getOrders(pagination);
    return res.status(result.status).json(result);
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: number, @Res() res: Response) {
    const result = await this.orderService.getOrdersByUser(Number(userId));
    return res.status(result.status).json(result);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number, @Res() res: Response) {
    const result = await this.orderService.getOrderById(Number(id));
    return res.status(result.status).json(result);
  }

  @Put(':id')
  @Roles(...allowedRolesMutation)
  async updateOrder(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.orderService.updateOrder(dto,Number(id));
    return res.status(result.status).json(result);
  }

  @Delete(':id')
  @Roles({ role: 'Admin', context: 'MT' })
  async deleteOrder(
    @Param('id') id: number,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.orderService.deleteOrder(Number(id), issuer.id);
    return res.status(result.status).json(result);
  }
}
