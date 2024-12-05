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
import { Router } from '@angular/router';
import { ProductStocksService } from '../../services/product-stocks.service';

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
    ProductName: null,
    SuperCategoryName: null,
    CategoryName: null,
    MinPrice: null,
    MaxPrice: null,
    MinStock: null,
    MaxStock: null,
    ColorName: null,
    ProductSize: null,
    Status: null,
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
    private colorService: ColorService,
    private router:Router,
    private productStocksService: ProductStocksService,
  ) {}

  ngOnInit(): void {
    this.isLoading=true;
    this.productService.getProductDetails().subscribe({
      next: (response) => {
        console.log('Gelen Veri:', response.data);
        this.productDetails = response.data.filter(product => product.status === true);
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

  applyFilter(): void {
    if(this.filters.superCategoryName=="1"){
      this.filters.superCategoryName="Kadın";
    }
    else if(this.filters.superCategoryName=="2"){
      this.filters.superCategoryName="Erkek";
    }
    else if(this.filters.superCategoryName=="3"){
      this.filters.superCategoryName="Kız Çocuk";
    }
    else if(this.filters.superCategoryName=="4"){
      this.filters.superCategoryName="Erkek Çocuk";
    }
    else if(this.filters.superCategoryName=="5"){
      this.filters.superCategoryName="Bebek";
    }
    console.log("status = "+this.filters.status);
    this.filters = {
      ProductName: this.filters.productName || null,
      SuperCategoryName: this.filters.superCategoryName || null,
      CategoryName: this.filters.categoryName || null,
      MinPrice: this.filters.minPrice || null,
      MaxPrice: this.filters.maxPrice || null,
      MinStock: this.filters.minStock || null,
      MaxStock: this.filters.maxStock || null,
      ColorName: this.filters.colorName || null,
      ProductSize: this.filters.productSize || null,
      Status: this.filters.status === null ? this.filters.status : null,
    };
  
    console.log('Gönderilen filtre:', this.filters); // Filtre objesini kontrol
  
    this.productService.filterProducts(this.filters).subscribe({
      next: (response: any) => {
        console.log('API Yanıtı:', response); // Yanıtı kontrol
        this.productDetails = response.filter((product: any) => {
          // Status true olanlar
          return product.status === true;
        });
        console.log('Ürün Detayları:', this.productDetails);
      },
      error: (error) => {
        console.error('Hata:', error); // Hata durumunu kontrol
      },
    });
    console.log('isLoading:', this.isLoading);
    console.log('errorMessage:', this.errorMessage);
  }

  resetFilters(): void {
    this.filters = {}; // Tüm filtreleri temizle
    this.applyFilter(); // Filtreyi uygula
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
  updateProduct(productStockId: number){
    this.router.navigate(['/product-stock-update', productStockId]);
  }

  toggleStatus(productDetails: any): void {
    const productStockId = productDetails.productStockId;

      this.productStocksService.deleteProductStock(productStockId).subscribe({
        next: () => {
          productDetails.status = !productDetails.status;
          this.toastrService.success('Product status updated successfully.');
        },
        error: () => this.toastrService.error('Failed to update status.'),
      });
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