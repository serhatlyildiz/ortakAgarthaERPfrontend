import { GetCartItem } from './getcartitem';

export interface GetCart {
  cartId: number;
  cartItems: GetCartItem[];
  userId: number;
  totalPrice: number;
  status: boolean;
}
