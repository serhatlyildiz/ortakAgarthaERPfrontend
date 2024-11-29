import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItems } from '../models/cartItems';
import { CartItem } from '../models/cartItem';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  constructor() { }

  addToCart(product:Product){
    let item = CartItems.find(c=>c.product.productId===product.productId);
    if(item){
      item.quantity+=1;
    }else{
      let cartItem = new CartItem();
      cartItem.product = product;
      cartItem.quantity = 1;
      CartItems.push(cartItem);
      this.cartItems.push(product);
      this.updateCartItemCount();
    }
  }

  removeFromCart(product:Product){
    let item:CartItem = CartItems.find(c=>c.product.productId===product.productId);
    CartItems.splice(CartItems.indexOf(item),1);
  }

  list():CartItem[]{
    return CartItems;
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  private updateCartItemCount() {
    this.cartItemCount.next(this.cartItems.length);
  }
}
