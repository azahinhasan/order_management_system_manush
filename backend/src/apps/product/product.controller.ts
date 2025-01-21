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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetIssuer } from 'src/decorators';
import { ProductDto } from './product.dto';
import { Request, Response } from 'express';
import { Users } from '@prisma/client';
import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from 'src/decorators/roles.decorator';

const allowedRolesMutation = [
  { role: 'MANAGER', context: 'MT' },
  { role: 'SUPER_ADMIN', context: 'MT' },
  { role: 'ADMIN', context: 'MT' },
  { role: 'DEVELOPER', context: 'MT' },
];

@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles(...allowedRolesMutation)
  async createProduct(
    @Body() dto: ProductDto,
    @GetIssuer() issuer: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.productService.createProduct(dto, issuer.user.id);
    return res.status(result.status).json(result);
  }

  @Get('list')
  async getProducts(@Res() res: Response) {
    const result = await this.productService.getProducts();
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
    @Body() dto: ProductDto,
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
