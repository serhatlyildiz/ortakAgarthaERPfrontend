import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { Colors } from '../../models/colors';
import { ColorService } from '../../services/colors.service';
import { SuperCategoryService } from '../../services/supercategory.service';
import { SuperCategoryModel } from '../../models/supercategory';
import { CategoryService } from '../../services/category.service';
import { CategoryModel } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImageService } from '../../services/product-image.service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-product-stock-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-stock-update.component.html',
  styleUrls: ['./product-stock-update.component.css'],
})
export class ProductStockUpdateComponent implements OnInit {
  productDetail: ProductDetailDto = {
    productDetailsId: 0,
    productId: 0,
    colorId: 0,
    productStocksId: 0,
    superCategoryId: 0,
    categoryId: 0,
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
  @ViewChild('fileInputn') fileInput: any;
  productImages = {
    images: [] as any[], // Mevcut fotoğraflar ve yeni eklenenler
  };
  temporaryImages: { file: File | null; preview: string; isNew: boolean }[] =
    []; // Yeni veya mevcut fotoğraflar
  deletedImages: string[] = []; // Silinen fotoğrafların yolları

  constructor(
    private colorService: ColorService,
    private route: ActivatedRoute,
    private superCategoryService: SuperCategoryService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private productImageService: ProductImageService,
    private toastrService: ToastrService
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
    this.productService
      .getByProductDetails(this.productStockId)
      .subscribe((response) => {
        if (response.data && response.data.length > 0) {
          this.productDetail = response.data[0]; // Ürün detaylarını yükle
          console.log('Product Details:', this.productDetail);

          // Super Category Eşleştirme
          const matchedSuperCategory = this.superCategories.find(
            (sc) =>
              sc.superCategoryName.trim().toLowerCase() ===
              this.productDetail.superCategoryName.trim().toLowerCase()
          );

          if (matchedSuperCategory) {
            this.selectedSuperCategoryId = matchedSuperCategory.superCategoryId;
          }

          // Kategorileri yükle ve eşleştir
          this.onSuperCategoryChange(this.selectedSuperCategoryId).then(() => {
            const matchedCategory = this.categories.find(
              (category) =>
                category.categoryName.trim().toLowerCase() ===
                this.productDetail.categoryName.trim().toLowerCase()
            );

            if (matchedCategory) {
              this.productDetail.categoryId = matchedCategory.categoryId;
            }
          });

          // Renk Eşleştirme
          const matchedColor = this.colors.find(
            (color) =>
              color.colorName.trim().toLowerCase() ===
              this.productDetail.colorName.trim().toLowerCase()
          );

          if (matchedColor) {
            this.productDetail.colorId = matchedColor.colorId;
          }

          // Fotoğrafları veritabanından yükle
          this.loadPhotosFromDatabase();
        }
      });
  }

  loadPhotosFromDatabase() {
    const databasePhotos: string[] = this.productDetail.images || [];
    this.temporaryImages = databasePhotos.map((photoPath) => ({
      file: null,
      preview: photoPath, // Dönen yol frontend için geçerli olacak
      isNew: false,
    }));
  }

  onSuperCategoryChange(superCategoryId: number): Promise<void> {
    return new Promise((resolve) => {
      if (superCategoryId) {
        this.categoryService
          .getBySuperCategoryId(superCategoryId)
          .subscribe((response) => {
            this.categories = response.data;
            resolve();
          });
      } else {
        this.categories = [];
        resolve();
      }
    });
  }

  saveProduct() {
    const updatedData = {
      product: {
        productId: this.productDetail.productId,
        productName: this.productDetail.productName,
        unitPrice: this.productDetail.unitPrice,
        productDescription: this.productDetail.productDescription,
        superCategoryId: Number(this.selectedSuperCategoryId),
        categoryId: Number(this.productDetail.categoryId),
      },
      productDetails: {
        productDetailsId: this.productDetail.productDetailsId,
        productSize: this.productDetail.productSize,
      },
      productStocks: {
        productStocksId: this.productDetail.productStocksId,
        unitsInStock: this.productDetail.unitsInStock,
        productColorId: Number(this.productDetail.colorId),
        images: this.temporaryImages.map((tempImage) => tempImage.preview),
        status: this.productDetail.status,
      },
    };
    console.log(updatedData);
    this.productService
      .update(
        updatedData.product,
        updatedData.productDetails,
        updatedData.productStocks
      )
      .subscribe(
        (response) => {
          console.log('Ürün başarıyla güncellendi:', response);
          this.toastrService.success('Ürün güncellendi');
          this.router.navigate(['/product-operations']);
        },
        (error) => {
          console.error('Ürün güncelleme sırasında hata oluştu:', error);
          this.toastrService.error('Ürün güncellenirken hata oluştu');
        }
      );
  }

  cancelUpdate(): void {
    this.router.navigate(['/product-operations']);
  }

  resetForm(): void {
    this.productDetail = { ...this.originalProductDetail };
    this.temporaryImages = [];
    this.deletedImages = [];
    this.loadPhotosFromDatabase();
    this.loadInitialData();
  }

  selectFiles() {
    this.fileInput.nativeElement.click();
  }

  /*
  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);
    console.log(this.temporaryImages);
    for (let file of fileArray) {
      const reader = new FileReader();
      reader.onload = () => {
        this.temporaryImages.push({
          file: file,
          preview: reader.result as string,
          isNew: true,
        });
      };
      reader.readAsDataURL(file);
    }
    console.log(this.temporaryImages);
  }
    */

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (let file of fileArray) {
      const reader = new FileReader();
      reader.onload = () => {
        const tempImage = {
          file: file,
          preview: reader.result as string, // Base64 formatında önizleme
          isNew: true,
        };

        this.temporaryImages.push(tempImage);

        // Fotoğrafı backend'e yükle
        const formData = new FormData();
        formData.append('files', file);

        this.productImageService.uploadPhoto(formData).subscribe(
          (response: string[]) => {
            response.forEach((base64: string) => {
              const index = this.temporaryImages.indexOf(tempImage);
              if (index !== -1) {
                this.temporaryImages[index] = {
                  file: null,
                  preview: `data:image/png;base64,${base64}`, // Base64 string
                  isNew: false,
                };
              }
            });
          },
          (error) => {
            console.error('Dosya yükleme hatası:', error);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  /*
  removeFile(index: number) {
    const image = this.temporaryImages[index];
    if (!image.isNew) {
      this.deletedImages.push(image.preview);
    }
    this.temporaryImages.splice(index, 1);
  }
    */
  removeFile(index: number) {
    const image = this.temporaryImages[index];

    if (!image.isNew) {
      this.deletedImages.push(image.preview); // Silinecek fotoğraf GUID'si eklenir
    } else if (image.file) {
      this.productImageService.deletePhoto(image.preview).subscribe(
        () => console.log(`Fotoğraf silindi: ${image.preview}`),
        (error) => console.error('Fotoğraf silme hatası:', error)
      );
    }

    this.temporaryImages.splice(index, 1);
  }
}
