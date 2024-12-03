import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItems } from '../models/cartItems';
import { CartItem } from '../models/cartItem';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private cartItems: Product[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  private apiUrl = 'http://localhost:5038/api/cart/';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  addToCart(product: Product) {
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      // Kullanıcı giriş yapmış, veritabanına ekle
      const userId = this.getUserId();
      if (userId) {
        const cartData = {
          userId: userId,
          productId: product.productId,
        };
        this.httpClient.post(this.apiUrl + "add-to-cart", cartData).subscribe({
          next: () => {
            console.log('Ürün veritabanına başarıyla eklendi.');
          },
          error: (err) => {
            console.error('Ürün eklenirken bir hata oluştu:', err);
          },
        });
      }
    } else {
      // Kullanıcı giriş yapmamış, localStorage'ye ekle
      let item = this.cartItems.find((c) => c.productId === product.productId);
      if (item) {
        // Ürün zaten localStorage'de, sadece miktarı arttır
        item['Quantity'] = (item['Quantity'] || 1) + 1;
      } else {
        // Yeni bir ürün ekle
        this.cartItems.push(product);
        this.updateCartItemCount();
      }
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  removeFromCart(product: Product) {
    const itemIndex = this.cartItems.findIndex(
      (c) => c.productId === product.productId
    );
    if (itemIndex !== -1) {
      this.cartItems.splice(itemIndex, 1);
      this.updateCartItemCount();
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  list(): Product[] {
    const cartFromStorage = localStorage.getItem('cart');
    if (cartFromStorage) {
      this.cartItems = JSON.parse(cartFromStorage);
    }
    return this.cartItems;
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  private updateCartItemCount() {
    this.cartItemCount.next(this.cartItems.length);
  }

  private getUserId(): number | null {
    // Kullanıcı ID'sini token'dan çözümleyerek al
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    }
    return null;
  }

  addToDatabaseCart(userId: string, productId: number): Observable<any> {
    const url = 'http://localhost:5038/api/Cart/add-to-cart';
    return this.httpClient.post(url, { userId, productId });
  }
  
  addToLocalStorageCart(product: Product): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find((item: any) => item.productId === product.productId);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartItemCount();
  }
}
