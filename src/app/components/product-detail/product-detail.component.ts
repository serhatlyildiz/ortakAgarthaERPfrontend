import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductDetailsService } from '../../services/product-details.service';
import { Colors } from '../../models/colors';
import { ColorService } from '../../services/colors.service';
import { ProductDetails } from '../../models/productDetail';
import { ProductStocksService } from '../../services/product-stocks.service';
import { ProductDetailDto2 } from '../../models/ProductDetailDto2';
import { ListResponseModel } from '../../models/listResponseModel';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { CartForPost } from '../../models/cartforpost';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product: ProductDetailDto2 | null = null;
  productSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  availableSizes: string[] = [];
  colors: Colors[] = [];
  availableColorIds: number[] = [];
  isLoaded = false;
  selectedSize: string = '';
  selectedColor: string = '';
  productImages: string[] = []; // Tüm fotoğrafları saklamak için dizi
  currentImageIndex: number = 0; // Şu anki fotoğrafın indeksi
  productDetailsId: number = 0;
  cartForPost: CartForPost[] = [];
  productStockIdForPost: number;
  quantityProduct: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productDetailsService: ProductDetailsService,
    private colorService: ColorService,
    private productStocksService: ProductStocksService,
    private router: Router,
    private cartService: CartService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.getProductDetail();
    this.getAvailableSizes();
    this.getColors();
  }

  getProductDetail(): void {
    this.productService
      .GetByProductIdForProductDetails2(this.productId)
      .subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            this.product = response.data[0];
            this.productImages = this.product?.images || [];
          }
          this.isLoaded = true;
        },
        error: (err) => {
          console.error('Product Error:', err);
        },
      });
  }

  getAvailableSizes(): void {
    this.productDetailsService.getAllByProductId(this.productId).subscribe({
      next: (response) => {
        this.availableSizes = response.data.map(
          (item: ProductDetails) => item.productSize
        );
      },
      error: (err) => {
        console.error('Sizes Error:', err);
      },
    });
  }

  getColors(): void {
    this.colorService.getAll().subscribe({
      next: (response) => {
        this.colors = response.data;
      },
      error: (err) => {
        console.error('Colors Error:', err);
      },
    });
  }

  isSizeAvailable(size: string): boolean {
    return this.availableSizes.includes(size);
  }

  onSizeChange(selectedSize: string): void {
    this.selectedSize = selectedSize;

    // Renk seçimlerini sıfırla
    this.selectedColor = ''; // Seçilen rengi temizle
    const colorInputs = document.querySelectorAll<HTMLInputElement>(
      'input[name="color-selection"]'
    );
    colorInputs.forEach((input) => (input.checked = false));

    this.updateAvailableColors(); // Mevcut renkleri güncelle
    this.updateProductImage(); // Ürün görselini güncelle
  }

  updateAvailableColors(): void {
    // Boyut seçildiğinde ürün detayları sorgulaması
    this.productDetailsService
      .getAllByProductIdAndSize(this.productId, this.selectedSize)
      .subscribe({
        next: (response: ListResponseModel<ProductDetails>) => {
          if (response.success && response.data.length > 0) {
            this.productDetailsId = response.data[0]?.productDetailsId;
            if (this.productDetailsId) {
              this.productStocksService
                .getAllByProductDetailsId(this.productDetailsId)
                .subscribe({
                  next: (colorResponse: ProductDetailDto2[]) => {
                    // Dönüş tipi artık dizi

                    if (colorResponse && colorResponse.length > 0) {
                      // Renk ID'lerini availableColorIds dizisine ekle
                      this.availableColorIds = colorResponse.map(
                        (item: ProductDetailDto2) => item.colorId
                      );
                      // Eğer gerekliyse resim URL'si güncellenebilir
                      if (colorResponse[0]?.images?.[0]) {
                        this.productImages = colorResponse[0]?.images; // İlk rengin resimlerini al
                      }
                    } else {
                      console.log(
                        'No available colors for this product details ID.'
                      );
                    }
                  },
                  error: (err) => {
                    console.error('Error fetching color stocks:', err);
                  },
                });
            }
          } else {
            console.log('No product details found for the selected size.');
          }
        },
        error: (err) => {
          console.error('Product Details Error:', err);
        },
      });
  }

  isColorAvailable(color: Colors): boolean {
    return this.availableColorIds.includes(color.colorId);
  }

  updateProductImage(): void {
    this.productDetailsService
      .getAllByProductIdAndSize(this.productId, this.selectedSize)
      .subscribe({
        next: (response: ListResponseModel<ProductDetails>) => {
          // API'den gelen yanıtın success durumunu kontrol et
          if (response.success && response.data.length > 0) {
            this.productDetailsId = response.data[0]?.productDetailsId; // İlk öğeden productDetailsId'yi al
            if (this.productDetailsId) {
              // getAllByProductDetailsId API çağrısı
              this.productStocksService
                .getAllByProductDetailsId(this.productDetailsId)
                .subscribe({
                  next: (colorResponse: ProductDetailDto2[]) => {
                    // colorResponse artık doğrudan bir dizi
                    if (colorResponse && colorResponse.length > 0) {
                      // Renklerin resimlerini güncelle
                      this.productImages =
                        colorResponse[0]?.images || this.productImages;
                    }
                  },
                  error: (err) => {
                    console.error('Image Error:', err);
                  },
                });
            }
          }
        },
        error: (err) => {
          console.error('Product Image Error:', err);
        },
      });
  }

  onColorChange(colorId: number): void {
    this.selectedColor = colorId.toString();
    if (!this.productDetailsId) {
      console.error('Product Details ID is not available!');
      return;
    }

    this.productStocksService
      .getAllByProductDetailsIdAndColor(this.productDetailsId, colorId)
      .subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            this.productImages = response[0]?.images || [];
            this.currentImageIndex = 0;
            this.productStockIdForPost = response[0]?.productStocksId;
          } else {
            console.warn('No data found for the selected color.');
          }
        },
        error: (err) => {
          console.error('Error fetching product images:', err);
        },
      });
  }

  nextImage(): void {
    if (this.productImages.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.productImages.length;
    }
  }

  previousImage(): void {
    if (this.productImages.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.productImages.length) %
        this.productImages.length;
    }
  }

  addToCartAndContinueShopping(): void {
    // Eğer cartForPost dizisi boşsa, yeni bir öğe ekleyin
    if (this.cartForPost.length === 0) {
      this.cartForPost.push({
        productStockId: this.productStockIdForPost,
        quantity: 1,
      });
    } else {
      // Eğer dizide zaten öğe varsa, mevcut öğeyi güncelleyin
      this.cartForPost[0].productStockId = this.productStockIdForPost;
      this.cartForPost[0].quantity = 1;
    }

    this.cartService.addToCart(this.cartForPost).subscribe({
      next: (response) => {
        if (response.success) console.log(response.message);
      },
      error: (err) => {
        console.error('ptrdtpatladık:', err);
      },
    });
    this.toastrService.success('Ürün Sepete Eklendi');
    this.router.navigate(['products']);
  }

  addToCartAndGoToCart(): void {
    // Eğer cartForPost dizisi boşsa, yeni bir öğe ekleyin
    if (this.cartForPost.length === 0) {
      this.cartForPost.push({
        productStockId: this.productStockIdForPost,
        quantity: 1,
      });
    } else {
      // Eğer dizide zaten öğe varsa, mevcut öğeyi güncelleyin
      this.cartForPost[0].productStockId = this.productStockIdForPost;
      this.cartForPost[0].quantity = 1;
    }

    this.cartService.addToCart(this.cartForPost).subscribe({
      next: (response) => {
        if (response.success) console.log(response.message);
      },
      error: (err) => {
        console.error('ptrdtpatladık:', err);
      },
    });
    this.toastrService.success('Ürün Sepete Eklendi');
    setTimeout(() => {
      this.router.navigate(['cart-summary']);
    }, 500); // 2000 ms = 2 saniye
  }
}
