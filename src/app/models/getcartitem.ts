import { ProductDetailDto } from './ProductDetailDto';

export interface GetCartItem {
  cartItemId: number;
  productStockId: number;
  quantity: number;
  unitPrice: number;
}
