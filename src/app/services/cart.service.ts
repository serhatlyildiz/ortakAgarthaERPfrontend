import { Injectable } from '@angular/core';
import { CartItem } from '../models/cartItem';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { GetCart } from '../models/getcart';
import { CartForPost } from '../models/cartforpost';

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

  addToCart(cartItems: CartForPost[]): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'add-to-cart',
      cartItems,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getCart(): Observable<SingleResponseModel<GetCart>> {
    return this.httpClient.get<SingleResponseModel<GetCart>>(
      this.apiUrl + 'your-cart'
    );
  }

  removeCartItem(productStockId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'remove-item-from-cart',
      { productStockId, userId: this.userId }
    );
  }

  clearCart(): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + 'clear-cart', {
      userId: this.userId,
    });
  }

  ///---------------------------------------------------------------------------------///

  saveCartToLocal(cartItems: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  getCartFromLocal(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  // syncLocalCartToBackend(): Observable<ResponseModel> {
  //   const localCart = this.getCartFromLocal();
  //   if (localCart.length === 0) {
  //     return new Observable<ResponseModel>((observer) => {
  //       observer.next({ success: true, message: 'Local cart is empty' });
  //       observer.complete();
  //     });
  //   }

  //   return this.addToCart(localCart).pipe(
  //     tap(() => {
  //       localStorage.removeItem('cart'); // Başarıyla kaydedildikten sonra temizle
  //     })
  //   );
  // }
}
