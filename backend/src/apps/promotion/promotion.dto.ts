import { IsBoolean, IsDate, IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  secondTitle: string;

  @IsInt()
  @Min(0)
  minimumRange: number;

  @IsInt()
  @Min(0)
  maximumRange: number;

  @IsInt()
  @Min(0)
  discountAmount: number;

  @IsInt()
  @Min(0)
  perWeight: number;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
