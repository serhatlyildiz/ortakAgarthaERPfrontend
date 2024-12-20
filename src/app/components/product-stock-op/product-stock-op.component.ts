import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { productDto } from '../../models/productDto';
import { Router } from '@angular/router';
import { ProductWithTotalStockDto } from '../../models/producWithTotalStockDto';

@Component({
  selector: 'app-product-stock-op',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-stock-op.component.html',
  styleUrls: ['./product-stock-op.component.css']
})
export class ProductStockOpComponent implements OnInit {
  products: productDto[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  sortOrder: string = 'asc'; // Varsayılan sıralama yönü (ascending)
  sortKey: string = 'productName'; // Varsayılan sıralama kolon adı
  filteredProducts: productDto[] = [];
  searchProductCode: string;

  constructor(private productService: ProductService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    // Tüm ürünleri al
    this.productService.getProductDto().subscribe({
      next: (response) => {
        this.products = response.data; // API'den gelen veriler
        this.filteredProducts = [...this.products]; // İlk filtreleme
  
        // Toplam stok verisini al
        this.productService.getProductsWithTotalStock().subscribe({
          next: (stockResponse) => {
            const totalStockMap = new Map<number, number>();
  
            // Total stock verilerini bir haritaya kaydet
            stockResponse.data.forEach((item: ProductWithTotalStockDto) => {
              totalStockMap.set(item.productId, item.totalStock);
            });
  
            // Stokları, ürünlere eşleştir
            this.products.forEach((product) => {
              product.totalStock = totalStockMap.get(product.productId) || 0;
            });
  
            this.filteredProducts = [...this.products]; // Güncellenmiş ürün listesi
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Stok verileri alınırken hata oluştu.', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }
  
  
  loadTotalStocks(): void {
    this.productService.getProductsWithTotalStock().subscribe({
      next: (response) => {
        const totalStockMap = new Map<number, number>();
  
        // Gelen veriyi bir Map yapısına çevir
        response.data.forEach((item) => {
          totalStockMap.set(item.productId, item.totalStock);
        });
  
        // Mevcut ürünlere stok bilgisini ekle
        this.products.forEach((product) => {
          product['totalStock'] = totalStockMap.get(product.productId) || 0;
        });
  
        this.filteredProducts = [...this.products]; // Güncellenmiş ürünleri yeniden ata
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Stok bilgileri yüklenirken bir hata oluştu.';
        this.isLoading = false;
        console.error(error);
      },
    });
  }
  

  filterProducts(): void {
    if (this.searchProductCode) {
      this.filteredProducts = this.products.filter(product =>
        product.productCode.toLowerCase().includes(this.searchProductCode.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products]; // Eğer arama yapılmazsa, tüm ürünleri göster
    }
  }

  // Örnek sort metodu
  sort(column: keyof productDto | 'totalStock'): void {
    this.filteredProducts.sort((a, b) => {
      let valueA, valueB;
  
      // Eğer 'totalStock' sıralanıyorsa özel işleme tabi tutulur
      if (column === 'totalStock') {
        valueA = a['totalStock'] ?? 0;
        valueB = b['totalStock'] ?? 0;
      } else {
        valueA = a[column] ?? '';
        valueB = b[column] ?? '';
      }
  
      // Karşılaştırma yapılır
      return (valueA > valueB ? 1 : -1) * (this.sortOrder === 'asc' ? 1 : -1);
    });
  
    // Sıralama yönünü değiştir
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortKey = column;
  }
  

  productStockUpdate(productCode: string, productId:  number){
    this.router.navigate(['/product-operations', productCode, productId]);
  }
  
  navigateToProductAdd(): void {
    this.router.navigate(['/products-add']);
  }

  deleteProduct(productId: number): void {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // API'den başarı dönerse ürünü listeden kaldır
          this.products = this.products.filter(product => product.productId !== productId);
          this.filteredProducts = this.filteredProducts.filter(product => product.productId !== productId);
          alert('Ürün başarıyla silindi.');
        },
        error: (err) => {
          console.error('Ürün silinirken bir hata oluştu:', err);
          alert('Ürün silinirken bir hata oluştu.');
        }
      });
    }
  }
  
}