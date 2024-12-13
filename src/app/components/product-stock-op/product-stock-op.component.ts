import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { productDto } from '../../models/productDto';
import { Router } from '@angular/router';

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
    this.productService.getProductDto().subscribe({
      next: (response) => {
        this.products = response.data; // API'den gelen verileri al
        this.filteredProducts = [...this.products]; // Başlangıçta tüm ürünleri göster
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu.';
        this.isLoading = false;
        console.error(error);
      }
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
  sort(column: keyof productDto): void {
    this.filteredProducts.sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';
      return (valueA > valueB ? 1 : -1) * (this.sortOrder === 'asc' ? 1 : -1);
    });
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortKey = column;
  }

  productStockUpdate(productCode: string, productId:  number){
    this.router.navigate(['/product-operations', productCode, productId]);
  }
  
  navigateToProductAdd(): void {
    this.router.navigate(['/products-add']);
  }
}