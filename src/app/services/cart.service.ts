import { Injectable } from '@angular/core';
import { CartItem } from '../models/cartItem';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Cart } from '../models/cart';
import { ResponseModel } from '../models/responseModel';
import { CartForPost } from '../models/cartforpost';
import { SingleResponseModel } from '../models/singleResponseModel';
import { GetCart } from '../models/getcart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5038/api/cart/';
  userId: number;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.userId = this.authService.getTokenInfo()?.userId || 0;
  }
  addToCart(cartItem: CartItem): Observable<ResponseModel> {
    const cartForPost: CartForPost = {
      userId: this.userId,
      productStockId: cartItem.product,
      quantity: cartItem.quantity,
    };
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'add-to-cart',
      cartForPost
    );
  }

  getCart(): Observable<SingleResponseModel<GetCart>> {
    return this.httpClient.get<SingleResponseModel<GetCart>>(
      this.apiUrl + 'your-cart?userId=' + 18
    );
  }

  clearCart(): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + 'clear-cart', {
      // this.userId,
    });
  }

  // Local Storage İşlemleri
  private addToLocalCart(cartItem: CartItem): void {
    let cart: Cart = JSON.parse(localStorage.getItem('cart') || 'null');
    if (!cart) {
      cart = {

        cartId: 0,
        cartItems: [],
        userId: 0,
        totalPrice: 0,
        status: true,
      };
    }

    const existingItem = cart.cartItems.find(
      (item) => item.product === cartItem.product
    );

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
    } else {
      cart.cartItems.push(cartItem);
    }

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.quantity * 100,
      0
    );

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private getLocalCart(): Cart | null {
    return JSON.parse(localStorage.getItem('cart') || 'null');
  }

  private clearLocalCart(): void {
    localStorage.removeItem('cart');
  }
}
