import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItems } from '../models/cartItems';
import { CartItem } from '../models/cartItem';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { ProductDetailDto } from '../models/ProductDetailDto';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // private cartItems: CartItem[] = [];
  // private cartItemCount = new BehaviorSubject<number>(0);
  // private apiUrl = 'http://localhost:5038/api/cart/';

  // constructor(
  //   private httpClient: HttpClient,
  //   private authService: AuthService
  // ) {
  //   this.loadCart();
  // }

  // private loadCart(): void {
  //   const userInfo = this.authService.getTokenInfo();
  //   if (userInfo) {
  //     //this.fetchCartFromApi(userInfo.userId);
  //   } else {
  //     this.loadCartFromLocalStorage();
  //   }
  // }

  // //daha başlamadı
  // // private fetchCartFromApi(userId: number): void {
  // //   this.httpClient
  // //     .get<ListResponseModel<CartItem>>(this.apiUrl + , { headers })
  // //     .subscribe((response) => {
  // //       if (response.success) {
  // //         this.cartItems = response.data;
  // //         this.updateCartItemCount();
  // //       }
  // //     });
  // // }

  // private loadCartFromLocalStorage(): void {
  //   const savedCart = localStorage.getItem('cart');
  //   if (savedCart) {
  //     this.cartItems = JSON.parse(savedCart);
  //     this.updateCartItemCount();
  //   }
  // }

  // private updateCartItemCount(): void {
  //   this.cartItemCount.next(this.cartItems.length);
  // }

  // // // Sepete ürün eklemek için
  // // addToCart(product: CartItem): void {
  // //   this.cartItems.push(product);
  // //   this.updateCartItemCount();
  // //   this.saveCart();
  // // }

  // // // Sepeti güncellemek için
  // // updateCart(updatedCart: CartItem[]): void {
  // //   this.cartItems = updatedCart;
  // //   this.updateCartItemCount();
  // //   this.saveCart();
  // // }

  // // Sepeti API'ye kaydetmek için
  // private saveCart(productId: number): void {
  //   const userId = this.authService.getTokenInfo().userId;

  //   if (userId) {
  //     this.httpClient
  //       .post(this.apiUrl + 'add-to-cart', { userId, productId })
  //       .subscribe((response) => {
  //         console.log(response);
  //       });
  //   } else {
  //     localStorage.setItem('cart', JSON.stringify(this.cartItems));
  //   }
  // }

  // // Sepet öğelerini al
  // getCartItems(): CartItem[] {
  //   return this.cartItems;
  // }

  // // Sepet öğesi sayısını al
  // getCartItemCount(): BehaviorSubject<number> {
  //   return this.cartItemCount;
  // }
}
