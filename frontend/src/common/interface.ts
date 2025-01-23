export interface IUpdateProductDto {
  name?: string;
  description?: string;
  currentPrice?: number;
  availableQuantity?: number;
  isActive?: boolean;
}
export interface ICreateProductDto {
  name: string;
  description: string;
  currentPrice: number;
  availableQuantity: number;
  isActive: boolean;
  unit: string;
}
