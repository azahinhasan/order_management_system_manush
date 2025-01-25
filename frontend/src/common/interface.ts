
enum UnitTypes {
  KILOGRAM = 'KILOGRAM',
  GRAM = 'GRAM',
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  PIECE = 'PIECE',
  PACK = 'PACK',
}

enum PromotionTypes {
  WEIGHTED = 'WEIGHTED',
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

export interface IUpdateProductDto {
  name?: string;
  description?: string;
  currentPrice?: number;
  perUnit?: number;
  availableQuantity?: number;
  isActive?: boolean;
}
export interface ICreateProductDto {
  name: string;
  description: string;
  currentPrice: number;
  perUnit: number;
  availableQuantity: number;
  isActive: boolean;
  unit: UnitTypes;
}

export interface IProductDto {
  name: string;
  description: string;
  currentPrice: number;
  perUnit: number;
  availableQuantity: number;
  isActive: boolean;
  unit: string;
  id:number;
}

export interface IPromotionDto {
  title: string;
  secondTitle?: string;
  minimumRange?: number;
  maximumRange?: number;
  discountAmount?: number;
  perQuantity?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  unit?: UnitTypes;
  type?: PromotionTypes
}

export interface ICreatePromotionDto {
  title: string;
  secondTitle: string;
  minimumRange: number;
  maximumRange: number;
  discountAmount: number;
  perQuantity: number;
  description: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  unit: UnitTypes;
  type: PromotionTypes
}


export interface IUpdatePromotionDto {
  title?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}


export interface IOrderItem {
  productName?: string;
  unit?: string;
  perUnit?: number;
  productId: number;
  orderQuantity: number;
  unitPrice: number;
  weightedDiscount: number;
  fixedDiscount: number;
  percentageDiscount: number;
  totalPrice: number;
}

export interface ICreateOrder {
  userId?: number;
  status?: string;
  items: IOrderItem[];
}

export interface IUpdateOrder {
  orderId?: number;
  status?: string;
  items?: IOrderItem[];
}
