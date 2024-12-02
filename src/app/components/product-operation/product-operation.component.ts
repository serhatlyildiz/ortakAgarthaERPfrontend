import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductDetailDto } from '../../models/ProductDetailDto';

@Component({
  selector: 'app-product-operations',
  standalone: true,
  templateUrl: './product-operation.component.html',
  styleUrls: ['./product-operation.component.css'],
  imports: [CommonModule]
})
export class ProductOperationComponent implements OnInit {
  productDetails: ProductDetailDto[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  sortDirection: boolean = true; // true: ascending, false: descending
  sortKey: string = 'productName'; // Default sort key
  sortColumn: string = 'productName';  // Varsayılan sıralama kolonunun adı
  sortOrder: string = 'asc';  // Varsayılan sıralama yönü (ascending)

  constructor(private productService: ProductService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.productService.getProductDetails().subscribe({
      next: (data) => {
        console.log('Gelen Veri:', data);
        this.productDetails = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Ürün detayları alınırken bir hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  toggleStatus(productDetails: any): void {
    const productId = productDetails.productId;

    this.productService.updateProductStatus(productId).subscribe({
      next: () => {
        productDetails.status = !productDetails.status;
        this.toastrService.success(`User status updated successfully.`);
      },
      error: () => this.toastrService.error('Failed to update status.'),
    });
  }

  sort(column: string): void {
    // Eğer aynı sütuna tıklanırsa yön değişir, aksi takdirde yeni sütun seçilir
    this.sortOrder = this.sortColumn === column && this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
  
    // Sıralama işlemi
    this.productDetails.sort((a, b) => {
      let valueA = a[column as keyof ProductDetailDto];
      let valueB = b[column as keyof ProductDetailDto];
  
      // Eğer değer string türündeyse, küçük harfe çevirme işlemi yapılır
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
  
      // Diğer türler için (number, boolean) karşılaştırma
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * (this.sortOrder === 'asc' ? 1 : -1);
      }
  
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return (valueA === valueB ? 0 : valueA ? 1 : -1) * (this.sortOrder === 'asc' ? 1 : -1);
      }
  
      // String olmayan türler için karşılaştırma yapılır (string[], object vb.)
      return (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * (this.sortOrder === 'asc' ? 1 : -1);
    });
  }
  
}
