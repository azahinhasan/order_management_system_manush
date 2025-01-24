import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  IsEnum
} from 'class-validator';

enum UnitTypes {
  KG = 'KG',
  GRAM = 'GRAM',
  LITER = 'LITER',
  METER = 'METER',
  PIECE = 'PIECE',
}

export class CreatePromotionDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  secondTitle: string;

  @IsNumber()
  @Min(0)
  minimumRange: number;

  @IsNumber()
  @Min(0)
  maximumRange: number;

  @IsNumber()
  @Min(0)
  discountAmount: number;

  @IsNumber()
  @Min(0)
  perQuantity: number;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsEnum(UnitTypes)
  unit: UnitTypes;
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
