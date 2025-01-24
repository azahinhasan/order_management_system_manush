import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetIssuer } from 'src/decorators';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Request, Response } from 'express';
import { Users } from '@prisma/client';
import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';
import { PaginationDto } from '../../lib/dtos/pagination.dto';

const allowedRolesMutation = [
  { role: 'MANAGER', context: 'MT' },
  { role: 'ADMIN', context: 'MT' },
  { role: 'DEVELOPER', context: 'MT' },
];

@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
@Roles({ role: 'SUPER_ADMIN', context: 'MT' })
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles(...allowedRolesMutation)
  async createProduct(
    @Body() dto: CreateProductDto,
    @GetIssuer() issuer: any,
    @Res() res: Response,
  ) {
    const result = await this.productService.createProduct(dto, issuer.user.id);
    return res.status(result.status).json(result);
  }

  @Get('list')
  async getProducts(
    @Query() pagination: PaginationDto,
    @Res() res: Response,
    @GetIssuer() issuer: any,
  ) {
    const result = await this.productService.getProducts(
      pagination,
      issuer.user.roleInfo.role === 'USER',
    );
    return res.status(result.status).json(result);
  }
  

  @Get(':id')
  async getProductById(@Param('id') id: number, @Res() res: Response) {
    const result = await this.productService.getProductById(Number(id));
    return res.status(result.status).json(result);
  }

  @Put(':id')
  @Roles(...allowedRolesMutation)
  async updateProduct(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.productService.updateProduct(
      Number(id),
      dto,
      issuer.id,
    );
    return res.status(result.status).json(result);
  }

  @Delete(':id')
  @Roles({ role: 'SUPER_ADMIN', context: 'MT' })
  async deleteProduct(
    @Param('id') id: number,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.productService.deleteProduct(
      Number(id),
      issuer.id,
    );
    return res.status(result.status).json(result);
  }
}
