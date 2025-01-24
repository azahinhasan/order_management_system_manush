import { IsInt, IsNotEmpty, IsPositive, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  orderQuantity: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  unitPrice: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  perUnit: number;

  @IsNumber()
  @Min(0)
  weightedDiscount: number;

  @IsNumber()
  @Min(0)
  fixedDiscount: number;

  @IsNumber()
  @Min(0)
  percentageDiscount: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  totalPrice: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  userId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsInt()
  @IsPositive()
  orderId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

