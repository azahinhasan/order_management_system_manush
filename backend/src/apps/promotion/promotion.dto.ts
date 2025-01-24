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

enum PromotionTypes {
  WEIGHTED = 'WEIGHTED',
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
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
  @IsOptional()
  minimumRange?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maximumRange?: number;

  @IsNumber()
  @Min(0)
  discountAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  perQuantity?: number;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  type: PromotionTypes;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsEnum(UnitTypes)
  @IsOptional()
  unit?: UnitTypes;
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
