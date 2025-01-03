import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { ProductService } from '../../services/product.service';
import { GetCart } from '../../models/getcart';
import { GetCartItem } from '../../models/getcartitem';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { CartForPost } from '../../models/cartforpost';

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
  cart: GetCart | null = null;
  cartItems: CartItem[] = [];
  errorMessage: string = '';
  productDetails: ProductDetailDto[];
  productDetail: ProductDetailDto;
  getCart: GetCartItem[];
  cartItem: ProductDetailDto[] = [];
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.cartItems = this.cartService.getLocalCart();
    } else {
      this.loadCart();
    }
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.cart = response.data;
          this.getCart = response.data.cartItems;
          const productRequests = this.getCart.map((cartItem) =>
            lastValueFrom(
              this.productService.getByProductDetails(cartItem.productStocksId)
            )
          );

          console.log(productRequests + ' asd');
          Promise.all(productRequests)
            .then((responses) => {
              console.log('2.satır');
              this.cartItem = responses.map((res, index) => ({
                ...res.data[0], // İlk ürün detayını al
                quantity: this.getCart[index].quantity, // Sepetteki miktar
              }));
              this.isLoading = false; // Yükleme tamamlandı
            })
            .catch((error) => {
              this.errorMessage = 'Ürün detayları yüklenirken hata oluştu.';
              console.error(error);
            });
        }
      },
      error: (error) => {
        this.errorMessage = error.errorMessage;
        console.error(error);
      },
    });
  }

  getByProductDetails(productStockId: number) {
    this.productService
      .getByProductDetails(productStockId)
      .subscribe((response) => {
        this.productDetail = response.data[0];
      });
  }

  updateQuantity(productStocksId: number, quantityChange: number): void {
    if (!this.cart) return;

    const item = this.cart.cartItems.find(
      (i) => i.productStocksId === productStocksId
    );
    if (!item) return;

    const updatedQuantity = item.quantity + quantityChange;
    if (updatedQuantity <= 0) {
      this.removeItem(productStocksId);
      return;
    }

    const updatedItem: CartForPost[] = [];
    updatedItem[0] = {
      productStockId: productStocksId,
      quantity: quantityChange,
    };

    this.cartService.addToCart(updatedItem).subscribe({
      next: () => this.loadCart(),
      error: (error) => {
        alert('Ürün miktarı güncellenirken bir hata oluştu.');
        console.error(error);
      },
    });
  }

  removeItem(productStocksId: number): void {
    this.cartService.clearCartItem(productStocksId).subscribe({
      next: () => {
        this.toastrService.success('Ürün başarıyla sepetten silindi.');
        this.loadCart();
      },
      error: (error) => {
        this.toastrService.error('Ürün sepetten silinirken bir hata oluştu.');
        console.error(error);
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => this.loadCart(),
      error: (error) => {
        alert('Sepet temizlenirken bir hata oluştu.');
        console.error(error);
      },
    });
  }

  addItemToCart(productStocksId: number): void {
    const newItem: CartForPost[] = [
      { productStockId: productStocksId, quantity: 1 },
    ];
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
}
