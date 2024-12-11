import { CartItem } from './cartItem';

export interface Cart {
  cartId: number;
  cartItems: CartItem[];
  userId: number;
  totalPrice: number;
  status: boolean;
}
