import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
