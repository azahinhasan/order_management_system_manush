import { IsString,Min, IsNumber, IsOptional, IsBoolean,IsEnum } from 'class-validator';

enum UnitTypes {
  KG = 'KG',
  GRAM = 'GRAM',
  LITER = 'LITER',
  METER = 'METER',
  PIECE = 'PIECE',
}

export class ProductDtoQuery {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  currentPrice: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  availableQuantity: number;

  @IsEnum(UnitTypes)
  @IsOptional()
  unit: UnitTypes;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  currentPrice: number;

  @IsNumber()
  @Min(0)
  availableQuantity: number;

  @IsEnum(UnitTypes)
  unit: UnitTypes;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  currentPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  availableQuantity?: number;

  // @IsEnum(UnitTypes)
  // @IsOptional()
  // unit?: UnitTypes;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

