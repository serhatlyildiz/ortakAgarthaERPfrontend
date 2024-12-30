import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { GetCart } from '../models/getcart';
import { CartForPost } from '../models/cartforpost';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5038/api/cart/';
  private cartKey = 'localCart';

  constructor(private httpClient: HttpClient) {}

  addToCart(cartItems: CartForPost[]): Observable<ResponseModel> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      return this.httpClient.post<ResponseModel>(
        this.apiUrl + 'add-to-cart',
        cartItems,
        { headers }
      );
    } else {
      const localCart = this.getLocalCart();
      localCart.push({ cartItems });
      this.setLocalCart(localCart);
      const response: ResponseModel = {
        message: 'Ürün yerel sepete kaydedildi.',
        success: true,
      };
      return new Observable((observer) => {
        observer.next(response);
        observer.complete();
      });
    }
  }

  syncLocalCartWithServer(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const localCart = this.getLocalCart();
      if (localCart.length > 0) {
        this.httpClient.post(this.apiUrl + "add-to-cart", localCart).subscribe({
          next: (response: any) => {
            if (response.success) {
              console.log('Yerel sepet sunucuya senkronize edildi.');
              this.clearLocalCart(); // Local storage temizleniyor
            }
          },
          error: (err) => console.error('Senkr. hatası:', err),
        });
      }
    }
  }

  getCart(): Observable<SingleResponseModel<GetCart>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.get<SingleResponseModel<GetCart>>(
      this.apiUrl + 'your-cart',
      { headers }
    );
  }

  clearCartItem(productStockId: number): Observable<ResponseModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'clear-cart-item',
      { productStockId },
      { headers }
    );
  }

  removeItemFromCart(cartItemId: number): Observable<ResponseModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'remove-item-from-cart',
      { cartItemId },
      { headers }
    );
  }

  clearCart(): Observable<ResponseModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<ResponseModel>(this.apiUrl + 'clear-cart', {
      headers,
    });
  }

  ///---------------------------------------------------------------------------------///

  getLocalCart(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  private setLocalCart(cart: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  private clearLocalCart(): void {
    localStorage.removeItem(this.cartKey);
  }
}
