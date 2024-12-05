import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: [
    './cart-summary.component.css',
    'fonts/icomoon/style.css',
    'css/bootstrap.min.css',
    'css/magnific-popup.css',
    'css/jquery-ui.css',
    'css/owl.carousel.min.css',
    'css/owl.theme.default.min.css',
    'css/aos.css',
    'css/style.css',
  ],
})
export class CartSummaryComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // this.cartItems = this.cartService.getCartItems();
    // // Sepet öğeleri güncellenirse bile UI'de güncellenmesini sağlar.
    // this.cartService.getCartItemCount().subscribe((count) => {
    //   // count değiştiğinde yapılacak işlemler (örneğin, UI'deki sepet ikonunu güncelleme)
    // });
  }

  // // Sepet öğesini silmek için
  // removeItem(cartItem: CartItem): void {
  //   this.cartItems = this.cartItems.filter(item => item !== cartItem);
  //   this.cartService.updateCart(this.cartItems);
  // }

  // // Sepet öğesinin miktarını güncellemek için
  // updateQuantity(cartItem: CartItem, quantity: number): void {
  //   const index = this.cartItems.findIndex(item => item === cartItem);
  //   if (index !== -1) {
  //     this.cartItems[index].quantity = quantity;
  //     this.cartService.updateCart(this.cartItems);
  //   }
  // }
}