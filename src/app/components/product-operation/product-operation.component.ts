import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperCategoryModel } from '../../models/supercategory';
import { CategoryModel } from '../../models/category';
import { SuperCategoryService } from '../../services/supercategory.service';
import { CategoryService } from '../../services/category.service';
import { Colors } from '../../models/colors';
import { ColorService } from '../../services/colors.service';
import { Component, OnInit } from '@angular/core';
import { ProductFilterModel } from '../../models/productfiltermodel';
import { ListResponseModel } from '../../models/listResponseModel';

@Component({
  selector: 'app-product-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-operation.component.html',
  styleUrls: ['./product-operation.component.css'],
})
export class ProductOperationComponent implements OnInit {
  productDetails: ProductDetailDto[] = [];
  filteredProducts: ProductFilterModel[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isFilterMenuOpen: boolean = false;
  currentImageIndex: { [key: number]: number } = {}; // Her ürünün resim dizini
  sortDirection: boolean = true; // true: ascending, false: descending
  sortKey: string = 'productName'; // Varsayılan sıralama kolon adı
  sortOrder: string = 'asc'; // Varsayılan sıralama yönü (ascending)
  superCategories: SuperCategoryModel[] = [];
  categories: CategoryModel[] = [];
  colors: Colors[] = [];
  filters: any = {
    productName: null,
    priceMin: null,
    priceMax: null,
    stockMin: null,
    stockMax: null,
    size: null,
    color: null,
    category: null,
    superCategory: null,
    status: null,
  };
  sizes = [
    { id: 'XS', name: 'XS' },
    { id: 'S', name: 'S' },
    { id: 'M', name: 'M' },
    { id: 'L', name: 'L' },
    { id: 'XL', name: 'XL' },
    { id: 'XXL', name: 'XXL' },
    { id: '3XL', name: '3XL' },
  ];

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private superCategoryService: SuperCategoryService,
    private categoryService: CategoryService,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.productService.getProductDetails().subscribe({
      next: (response) => {
        console.log('Gelen Veri:', response.data);
        this.productDetails = response.data;
        this.isLoading = false;

        // Resim dizini başlatma
        this.productDetails.forEach((product) => {
          this.currentImageIndex[product.productId] = 0; // İlk resim gösterilsin
        });
      },
      error: (error) => {
        this.errorMessage = 'Ürün detayları alınırken bir hata oluştu.';
        this.isLoading = false;
      },
    });
    this.loadSuperCategories();
    this.loadColors();
    this.loadSuperCategories();
    this.loadColors();
  }

  loadColors() {
    this.colorService.getAll().subscribe((response) => {
      this.colors = response.data;
    });
  }

  loadSuperCategories() {
    this.superCategoryService.getAll().subscribe((response) => {
      this.superCategories = response.data;
    });
  }

  onSuperCategoryChange(superCategoryId: number) {
    if (superCategoryId) {
      // SuperCategory'ye ait Category'leri al
      this.categoryService
        .getBySuperCategoryId(superCategoryId)
        .subscribe((response) => {
          this.categories = response.data; // Kategorileri güncelle
          this.filters.category = null; // Önceki seçili kategoriyi sıfırla
        });
    } else {
      // Eğer SuperCategory seçilmediyse, kategori listesini temizle
      this.categories = [];
      this.filters.category = null; // Kategoriyi sıfırla
    }
  }

  onFilterMenuOpen() {
    this.isFilterMenuOpen = true;
  }

  // FILTER menüsü kapandığında
  onFilterMenuClose() {
    this.isFilterMenuOpen = false;
  }

  fetchProducts(): void {
    this.productService.getProductDetails().subscribe({
      next: (response) => {
        this.productDetails = response.data;
        this.filteredProducts = [...this.productDetails];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message;
        this.isLoading = false;
      },
    });
  }

  applyFilter(): void {
    console.log('Gönderilen filtre:', this.filters); // Gönderilen filtreyi konsola yazdır
  
    this.productService.filterProducts(this.filters).subscribe(
      (response: any) => {
        console.log('API Yanıtı:', response); // API yanıtını detaylı şekilde inceleyin
        if (response && Array.isArray(response) && response.length > 0) {
          // Yanıtın veri dizisi içerdiğinden emin olun
          let filtered = response;
  
          // Price Min/Max filtresi
          if (this.filters.priceMin != null) {
            filtered = filtered.filter(product => product.unitPrice >= this.filters.priceMin);
          }
          if (this.filters.priceMax != null) {
            filtered = filtered.filter(product => product.unitPrice <= this.filters.priceMax);
          }
  
          // Stock Min/Max filtresi
          if (this.filters.stockMin != null) {
            filtered = filtered.filter(product => product.unitsInStock >= this.filters.stockMin);
          }
          if (this.filters.stockMax != null) {
            filtered = filtered.filter(product => product.unitsInStock <= this.filters.stockMax);
          }
  
          // Product Name filtresi
          if (this.filters.productName) {
            filtered = filtered.filter(product => product.productName.toLowerCase().includes(this.filters.productName.toLowerCase()));
          }
  
          // Size filtresi
          if (this.filters.size) {
            filtered = filtered.filter(product => product.size === this.filters.size);
          }
  
          // Color filtresi
          if (this.filters.color) {
            filtered = filtered.filter(product => product.color === this.filters.color);
          }
  
          // Category filtresi
          if (this.filters.category) {
            filtered = filtered.filter(product => product.categoryId === this.filters.category);
          }
  
          // SuperCategory filtresi
          if (this.filters.superCategory) {
            filtered = filtered.filter(product => product.superCategoryId === this.filters.superCategory);
          }
  
          // Status filtresi (true/false kontrolü)
          if (this.filters.status !== null) {
            filtered = filtered.filter(product => product.status === this.filters.status);
          }
  
          // Filtrelenmiş ürünleri güncelle
          this.productDetails = filtered;
          console.log('Filtrelenmiş ürünler:', this.productDetails);  // Filtrelenmiş ürünleri kontrol edin
        } else {
          console.error('Yanıt beklenen yapıdaki veriyi içermiyor.');
        }
      },
      (error) => {
        console.error('Hata:', error);
      }
    );
  }

  resetFilters(): void {
    this.filters = {
      productName: '',
      priceMin: null,
      priceMax: null,
      stockMin: null,
      stockMax: null,
      size: null,
      color: null,
      category: null,
      superCategory: null,
      status: null,
    };
  }

  // Resim değiştirme fonksiyonu
  nextImage(productId: number): void {
    const product = this.productDetails.find((p) => p.productId === productId);
    if (product && product.images.length > 0) {
      this.currentImageIndex[productId] =
        (this.currentImageIndex[productId] + 1) % product.images.length;
    }
  }

  // Resim değiştirme işlemi
  previousImage(productId: number): void {
    const product = this.productDetails.find((p) => p.productId === productId);
    if (product && product.images.length > 0) {
      this.currentImageIndex[productId] =
        (this.currentImageIndex[productId] - 1 + product.images.length) %
        product.images.length;
    }
  }

  toggleStatus(productDetails: any): void {
    const productId = productDetails.productId;

    if (productDetails.status === true) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          productDetails.status = !productDetails.status;
          this.toastrService.success('User status updated successfully.');
        },
        error: () => this.toastrService.error('Failed to update status.'),
      });
    } else {
      this.productService.activateProduct(productId).subscribe({
        next: () => {
          productDetails.status = !productDetails.status;
          this.toastrService.success('User status updated successfully.');
        },
        error: () => this.toastrService.error('Failed to update status.'),
      });
    }
  }

  // Sıralama fonksiyonu
  sort(column: string): void {
    // Eğer aynı sütuna tıklanırsa yön değişir, aksi takdirde yeni sütun seçilir
    if (this.sortKey === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column;
      this.sortOrder = 'asc'; // Yeni sütun için sıralama yönünü varsayılan olarak 'asc' yapıyoruz
    }

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
        return (
          (valueA === valueB ? 0 : valueA ? 1 : -1) *
          (this.sortOrder === 'asc' ? 1 : -1)
        );
      }

      // String olmayan türler için karşılaştırma yapılır (string[], object vb.)
      return (
        (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) *
        (this.sortOrder === 'asc' ? 1 : -1)
      );
    });
  }
}