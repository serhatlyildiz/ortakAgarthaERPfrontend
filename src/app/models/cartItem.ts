import { ProductDetailDto } from './ProductDetailDto';

export interface CartItem {
  product: ProductDetailDto;
  quantity: number;
}
