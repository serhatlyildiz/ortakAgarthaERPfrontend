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
import { TemporaryImage } from '../../models/temporayImage';
import { ProductStatusHistoryModel } from '../../models/productStatusHistoryModel';
import { ProductStatusHistoryService } from '../../services/product-status-history-service';
import { TokenInfo } from '../../models/tokenInfo';
import { AuthService } from '../../services/auth.service';

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
    productCode: '',
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
  paramProductCode: string;
  paramPorductId: number;
  @ViewChild('fileInputn') fileInput: any;
  productImages = {
    images: [] as any[], // Mevcut fotoğraflar ve yeni eklenenler
  };

  temporaryImages: { fileName: File | ''; preview: string; isNew: boolean }[] = []; // Yeni veya mevcut fotoğraflar
  deletedImages: string[] = []; // Silinen fotoğrafların yolları

  tokenInfo: TokenInfo | null = null;
    firstName: string;
    lastName: string;

  constructor(
    private colorService: ColorService,
    private route: ActivatedRoute,
    private superCategoryService: SuperCategoryService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private productImageService: ProductImageService,
    private toastrService: ToastrService,
    private productStatusHistoryService: ProductStatusHistoryService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productStockId = Number(params['productStockId']);
    });

    this.loadInitialData();
    this.tokenInfo = this.authService.getTokenInfo();
    if (this.tokenInfo) {
      const fullName = this.tokenInfo.name;
      const nameParts = fullName.split(' ');
      this.firstName = nameParts[0];
      this.lastName = nameParts.slice(1).join(' ');
    }
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
          
          // Eski ürün verilerini kaydediyoruz
          this.originalProductDetail = { ...this.productDetail };
  
          // Parametreler için değerleri kaydedelim
          this.paramProductCode = this.productDetail.productCode;
          this.paramPorductId = this.productDetail.productId;
  
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
    this.temporaryImages = databasePhotos.map((photoPath) => {
      return {
        fileName: '',
        preview: photoPath, // Dönen yol frontend için geçerli olacak
        isNew: false,
      };
    });
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
        productCode: this.productDetail.productCode,
      },
      productDetails: {
        productDetailsId: this.productDetail.productDetailsId,
        productSize: this.productDetail.productSize,
        productCode: this.productDetail.productCode,
      },
      productStocks: {
        productStocksId: this.productDetail.productStocksId,
        unitsInStock: this.productDetail.unitsInStock,
        productColorId: Number(this.productDetail.colorId),
        images: this.temporaryImages.map((tempImage) => tempImage.preview),
        status: this.productDetail.status,
      },
    };
  
    // Eski ve yeni veriler arasındaki farkları karşılaştır
    let remarks = '';
  
    if (this.originalProductDetail.productName !== this.productDetail.productName) {
      remarks += `Ürün Adı değişti: Eski - ${this.originalProductDetail.productName}, Yeni - ${this.productDetail.productName}. `;
    }
    if (this.originalProductDetail.unitPrice !== this.productDetail.unitPrice) {
      remarks += `Birim Fiyat değişti: Eski - ${this.originalProductDetail.unitPrice}, Yeni - ${this.productDetail.unitPrice}. `;
    }
    if (this.originalProductDetail.productDescription !== this.productDetail.productDescription) {
      remarks += `Ürün Açıklaması değişti: Eski - ${this.originalProductDetail.productDescription}, Yeni - ${this.productDetail.productDescription}. `;
    }
    if (this.originalProductDetail.productSize !== this.productDetail.productSize) {
      remarks += `Ürün Bedeni değişti: Eski - ${this.originalProductDetail.productSize}, Yeni - ${this.productDetail.productSize}. `;
    }
    if (this.originalProductDetail.unitsInStock !== this.productDetail.unitsInStock) {
      remarks += `Stok Miktarı değişti: Eski - ${this.originalProductDetail.unitsInStock}, Yeni - ${this.productDetail.unitsInStock}. `;
    }
    if (this.originalProductDetail.colorName !== this.productDetail.colorName) {
      remarks += `Renk değişti: Eski - ${this.originalProductDetail.colorName}, Yeni - ${this.productDetail.colorName}. `;
    }
    if (this.originalProductDetail.productCode !== this.productDetail.productCode) {
      remarks += `Ürün Kodu değişti: Eski - ${this.originalProductDetail.productCode}, Yeni - ${this.productDetail.productCode}. `;
    }
  
    let historyModel: ProductStatusHistoryModel = {
      historyId: 0, // Backend tarafından otomatik oluşturulabilir
      productStockId: this.productStockId, // Yeni eklenen stok ID burada kullanılırsa backend'den alınmalı
      productId: this.paramPorductId,
      productDetailsId: 0, // Eğer productDetailsId kullanılacaksa backend'den alınmalı
      status: true, // Başarılı işlem olduğu için true
      changedBy: this.tokenInfo.userId, // Kullanıcı ID'si. Oturum açan kullanıcının ID'sini alabilirsiniz.
      productCode: this.paramProductCode,
      changedByFirstName: this.firstName, // Oturum açan kullanıcının adı alınabilir
      changedByLastName: this.lastName, // Oturum açan kullanıcının soyadı alınabilir
      email: this.tokenInfo.email, // Kullanıcı emaili
      changeDate: new Date(), // Değişiklik tarihi
      operations: "Güncelleme", // İşlem türü
      remarks: remarks || " Stok güncellendi.", // Eski ve yeni verilerin farkları
    };
  
    this.productService
      .update(
        updatedData.product,
        updatedData.productDetails,
        updatedData.productStocks
      )
      .subscribe(
        (response) => {
          this.toastrService.success('Ürün güncellendi');
          
          // Geçmiş kaydı ekleyelim
          this.productStatusHistoryService.add(historyModel).subscribe(
            (historyResponse) => {
              if (historyResponse.success) {
                
              }
            },
            (historyError) => {
              this.toastrService.error("Geçmiş kaydı sırasında bir hata oluştu.", "Hata");
              console.error("Geçmiş kaydı hatası:", historyError);
            }
          );
  
          this.router.navigate(['/product-operations', this.paramProductCode, this.paramPorductId]);
        },
        (error) => {
          if (error.error && error.error.message) {
            this.toastrService.error(error.error.message);
          } else {
            this.toastrService.error('Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
          }
        }
      );
  }
  

  cancelUpdate(productCode: string, productId: number): void {
    this.router.navigate(['/product-operations', productCode, productId]);
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

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (let file of fileArray) {
      const reader = new FileReader();
      reader.onload = () => {
        const tempImage = {
          fileName: file,
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
                  fileName: '',
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
  removeFile(index: number) {
    const image = this.temporaryImages[index];

    if (!image.isNew) {
      this.deletedImages.push(image.preview); // Silinecek fotoğraf GUID'si eklenir
    } else if (image.fileName) {
      this.productImageService.deletePhoto(image.preview).subscribe(
        () => console.log(`Fotoğraf silindi: ${image.preview}`),
        (error) => console.error('Fotoğraf silme hatası:', error)
      );
    }

    this.temporaryImages.splice(index, 1);
  }
}
