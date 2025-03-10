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
import { PromotionService } from './promotion.service';
import { GetIssuer } from 'src/decorators';
import { CreatePromotionDto, UpdatePromotionDto } from './promotion.dto';
import { Response } from 'express';
import { Users } from '@prisma/client';
import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';
import { PaginationDto } from 'src/lib/dtos/pagination.dto';

const allowedRolesMutation = [
  { role: 'MANAGER', context: 'MT' },
  { role: 'ADMIN', context: 'MT' },
  { role: 'DEVELOPER', context: 'MT' },
  { role: 'SUPER_ADMIN', context: 'MT' },
];

@Controller('promotion')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...allowedRolesMutation)
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Post()
  async createPromotion(
    @Body() dto: CreatePromotionDto,
    @GetIssuer() issuer: any,
    @Res() res: Response,
  ) {
    const result = await this.promotionService.createPromotion(dto, issuer.user.id);
    return res.status(result.status).json(result);
  }

  @Get('list')
  async getPromotions( @Query() pagination: PaginationDto,@Res() res: Response) {
    const result = await this.promotionService.getPromotions(pagination);
    return res.status(result.status).json(result);
  }

  @Get('list/available')
  @Roles({ role: 'USER', context: 'CLIENT' })
  async getAvailablePromotions(@Res() res: Response) {
    const result = await this.promotionService.getAvailablePromotions();
    return res.status(result.status).json(result);
  }

  @Get(':id')
  async getPromotionById(@Param('id') id: number, @Res() res: Response) {
    const result = await this.promotionService.getPromotionById(Number(id));
    return res.status(result.status).json(result);
  }

  @Put(':id')
  async updatePromotion(
    @Param('id') id: number,
    @Body() dto: UpdatePromotionDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.promotionService.updatePromotion(
      Number(id),
      dto,
      issuer.id,
    );
    return res.status(result.status).json(result);
  }

  @Delete(':id')
  async deletePromotion(
    @Param('id') id: number,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.promotionService.deletePromotion(
      Number(id),
      issuer.id,
    );
    return res.status(result.status).json(result);
  }
}
