import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { Colors } from '../../models/colors';
import { ColorService } from '../../services/colors.service';
import { SuperCategoryService } from '../../services/supercategory.service';
import { SuperCategoryModel } from '../../models/supercategory';
import { CategoryService } from '../../services/category.service';
import { CategoryModel } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-stock-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-stock-update.component.html',
  styleUrls: ['./product-stock-update.component.css'],
})
export class ProductStockUpdateComponent implements OnInit {
  productDetail: ProductDetailDto = {
    productStockId: 0,
    productId: 0,
    categoryId: 0,
    superCategoryId: 0,
    colorId: 0,
    productName: '',
    superCategoryName: '',
    categoryName: '',
    productDescription: '',
    unitPrice: 0,
    unitsInStock: 0,
    colorName: '',
    productSize: '',
    images: [],
    status: true,
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
  colors: Colors[] = [];
  superCategories: SuperCategoryModel[] = [];
  categories: CategoryModel[] = [];
  selectedSuperCategoryId: number | null = null;
  productStockId: number = 0;
  isLoading: boolean = true;
  originalProductDetail: ProductDetailDto = { ...this.productDetail };


  constructor(
    private colorService: ColorService,
    private route: ActivatedRoute,
    private superCategoryService: SuperCategoryService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productStockId = Number(params['productStockId']);
    });

    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;

    // Renkler ve Süper Kategoriler paralel yüklenir
    Promise.all([this.loadColors(), this.loadSuperCategories()])
      .then(() => this.loadProductDetails())
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadColors(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.colorService.getAll().subscribe(
        (response) => {
          this.colors = response.data;
          resolve();
        },
        (error) => reject(error)
      );
    });
  }

  loadSuperCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.superCategoryService.getAll().subscribe(
        (response) => {
          this.superCategories = response.data;
          resolve();
        },
        (error) => reject(error)
      );
    });
  }

  loadProductDetails() {
    this.productService.getByProductDetails(this.productStockId).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        this.productDetail = response.data[0]; // Ürün detaylarını yükle
        console.log('Product Details:', this.productDetail);
  
        // Super Category Eşleştirme
        const matchedSuperCategory = this.superCategories.find(
          (sc) =>
            sc.superCategoryName.trim().toLowerCase() ===
            this.productDetail.superCategoryName.trim().toLowerCase()
        );
        console.log('Matched Super Category:', matchedSuperCategory);
  
        if (matchedSuperCategory) {
          this.selectedSuperCategoryId = matchedSuperCategory.superCategoryId;
  
          // Kategorileri yükle ve eşleştir
          this.onSuperCategoryChange(this.selectedSuperCategoryId).then(() => {
            console.log('Categories:', this.categories); // Tüm kategorileri yazdır
            console.log('Product Category Name:', this.productDetail.categoryName); // Ürün detaylarındaki kategori adı
          
            const matchedCategory = this.categories.find(
              (category) =>
                category.categoryName.trim().toLowerCase() ===
                this.productDetail.categoryName.trim().toLowerCase() // Case-insensitive eşleşme
            );
          
            if (matchedCategory) {
              this.productDetail.categoryId = matchedCategory.categoryId;
              console.log('Matched Category:', matchedCategory);
            } else {
              console.warn('No matching category found!');
              console.log(
                'Possible Categories:',
                this.categories.map((c) => c.categoryName) // Kategori adlarını yazdır
              );
              console.log('Looking for:', this.productDetail.categoryName);
            }
          });
        } else {
          console.warn('No matching super category found!');
        }
  
        // Renk Eşleştirme
        console.log('Colors:', this.colors);
        const matchedColor = this.colors.find(
          (color) =>
            color.colorName.trim().toLowerCase() ===
            this.productDetail.colorName.trim().toLowerCase()
        );
  
        if (matchedColor) {
          this.productDetail.colorId = matchedColor.colorId; // Renk ID'sini ata
          console.log('Matched Color:', matchedColor);
        } else {
          console.warn('No matching color found!');
        }
      } else {
        console.error('No product details found for the given productStockId.');
      }
    });
  }
  
  

  onSuperCategoryChange(superCategoryId: number): Promise<void> {
    return new Promise((resolve) => {
      if (superCategoryId) {
        this.categoryService.getBySuperCategoryId(superCategoryId).subscribe((response) => {
          this.categories = response.data; // Kategorileri güncelle
          console.log('Categories Loaded:', this.categories);
          resolve();
        });
      } else {
        this.categories = [];
        resolve();
      }
    });
  }
  

  saveProduct() {
    console.log('Ürün kaydedildi:', this.productDetail);
    // Ürün kaydetme işlemleri burada yapılabilir
  }

  cancelUpdate(): void {
    console.log('Güncelleme iptal edildi');
    this.router.navigate(['/product-operations']);
  }
  
  resetForm(): void {
    // Orijinal ürün verisini geri yükleriz
    this.productDetail = { ...this.originalProductDetail };

    // İlçe verilerini tekrar yükleriz (örneğin, loadInitialIlce gibi)
    this.loadInitialData();

    // Konsola resetlendi bilgisini yazdırırız
    console.log('Form resetlendi:', this.productDetail);
  }

  addPhoto(): void {
    console.log('Add photo button clicked');
    // Burada fotoğraf ekleme işlemi yapılabilir
  }
  
  deletePhoto(image: string): void {
    console.log('Delete photo clicked for image:', image);
    // Fotoğraf silme işlemi burada yapılabilir
    // Örneğin, diziden bu fotoğrafı silebilirsiniz:
    this.productDetail.images = this.productDetail.images.filter(img => img !== image);
  }
  

}
