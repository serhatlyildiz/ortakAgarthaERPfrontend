import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { ProductService } from '../../services/product.service';
import { GetCart } from '../../models/getcart';
import { GetCartItem } from '../../models/getcartitem';

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
  cart: Cart;
  loading: boolean = false;
  errorMessage: string = '';
  productDetails: ProductDetailDto[];
  productDetail: ProductDetailDto;
  getCart: GetCartItem[];
  getCartItem: GetCartItem[];
  cartSummary: any[] = [];
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  getByProductDetails(productStockId: number) {
    this.productService
      .getByProductDetails(productStockId)
      .subscribe((response) => {
        this.productDetail = response.data[0];
      });
  }

  loadCart(): void {
    // this.cartService.getCart().subscribe((response) => {
    //   if (response.success) {
    //     this.getCart = response.data.cartItems;

    //     this.getCart.forEach((element) => {
    //       this.productService.getByProductDetails(element.productStockId).subscribe( response => {
    //         if (response.success){
              
    //         }
    //       });
    //     });
    //   }
    // });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;

    const updatedItem = { ...item, quantity: newQuantity };
    this.cartService.addToCart(updatedItem).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCart();
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        alert('Ürün miktarı güncellenirken bir hata oluştu.');
        console.error(error);
      },
    });
  }

  removeItem(item: CartItem): void {
    const updatedItem = { ...item, quantity: 0 }; // Miktarı sıfır göndererek ürün kaldırılıyor
    this.cartService.addToCart(updatedItem).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCart();
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        alert('Ürün kaldırılırken bir hata oluştu.');
        console.error(error);
      },
    });
  }

  addItemToCart(productId: number): void {
    const newItem: CartItem = { product: productId, quantity: 1 };
    this.cartService.addToCart(newItem).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCart();
          alert('Ürün sepete eklendi.');
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        alert('Sepete ekleme sırasında bir hata oluştu.');
        console.error(error);
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (response) => {
        if (response.success) {
          this.cart = null;
          alert('Sepet temizlendi.');
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        alert('Sepet temizleme sırasında bir hata oluştu.');
        console.error(error);
      },
    });
  }
}
