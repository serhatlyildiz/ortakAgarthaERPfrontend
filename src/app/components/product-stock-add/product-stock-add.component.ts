import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SuperCategoryModel } from '../../models/supercategory';
import { CategoryModel } from '../../models/category';
import { Colors } from '../../models/colors';
import { SuperCategoryService } from '../../services/supercategory.service';
import { CategoryService } from '../../services/category.service';
import { ColorService } from '../../services/colors.service';
import { productDto } from '../../models/productDto';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductStockAddDto } from '../../models/productStockAddDto';
import { ProductImageService } from '../../services/product-image.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductStatusHistoryService } from '../../services/product-status-history-service';
import { ProductStatusHistoryModel } from '../../models/productStatusHistoryModel';
import { TokenInfo } from '../../models/tokenInfo';
import { AuthService } from '../../services/auth.service';
import { ProductStocksService } from '../../services/product-stocks.service';

@Component({
  selector: 'app-product-stock-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-stock-add.component.html',
  styleUrls: ['./product-stock-add.component.css']
})
export class ProductStockAddComponent implements OnInit {
  
  categoryId: number;
  superCategoryId: number;
  categoryName: string;
  superCategoryName: string;
  paramProductCode: string;
  paramProductId: number;
  productDescription: string;
  isLoading: boolean = true;
  superCategories: SuperCategoryModel[] = [];
  categories: CategoryModel[] = [];
  colors: Colors[] = [];
  @ViewChild('fileInputn') fileInput: any;
  sizes = [
    { id: 'XS', name: 'XS' },
    { id: 'S', name: 'S' },
    { id: 'M', name: 'M' },
    { id: 'L', name: 'L' },
    { id: 'XL', name: 'XL' },
    { id: 'XXL', name: 'XXL' },
    { id: '3XL', name: '3XL' },
  ];

  products: Product = {
    productId: 0,
    categoryId: 0,
    productName: '',
    productDescription: '',
    unitPrice: 0,
    Status: true,
    productCode: ''
  };
  temporaryImages: { file: File | ""; preview: string; isNew: boolean }[] =
    []; // Yeni veya mevcut fotoğraflar
  deletedImages: string[] = []; // Silinen fotoğrafların yolları

  productDetail: ProductStockAddDto = {
      ProductDetailsId: 0,
      ProductId: 0,
      ProductColorId: 0,
      ProductStocksId: 0,
      ProductSize: '',
      Status: true,
      ProductCode: '',
      UnitsInStock: 0,
      Images: [],
      
    };

    tokenInfo: TokenInfo | null = null;
      firstName: string;
      lastName: string;
      lastProductStockId: number;

  constructor(
    private route: ActivatedRoute,
    private colorService: ColorService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private superCategoryService: SuperCategoryService,
    private productImageService: ProductImageService,
    private router: Router,
    private toastrService: ToastrService,
    private productStatusHistoryService: ProductStatusHistoryService,
    private authService: AuthService,
    private productStocksService: ProductStocksService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productCode = params.get('productCode');
      const productId = params.get('productId');
      this.paramProductCode = productCode || '';
      this.paramProductId = Number(productId);
  
      if (this.paramProductId) {
        this.loadInitialData(this.paramProductId);
      } else {
        console.error('Ürün ID parametresi bulunamadı.');
      }
  
      this.loadColors();
    });
    this.tokenInfo = this.authService.getTokenInfo();
    if (this.tokenInfo) {
      const fullName = this.tokenInfo.name;
      const nameParts = fullName.split(' ');
      this.firstName = nameParts[0];
      this.lastName = nameParts.slice(1).join(' ');
    }
  }
  

  loadInitialData(productId: number) {
    this.productService.getById(productId).subscribe(
      (response) => {
        // Gelen response bir dizi mi yoksa nesne mi kontrol et
        if (response.data) {
          this.products = Array.isArray(response.data) ? response.data[0] : response.data;
          
          // Ürün nesnesi doğru şekilde yüklendi mi kontrol et
          if (this.products && this.products.categoryId) {
            this.categoryId = this.products.categoryId;
            this.productDescription = this.products.productDescription;
            this.loadCategory(this.categoryId);
          } else {
            console.error('Kategori ID bulunamadı.');
          }
        } else {
          console.error('Gelen ürün verisi boş.');
        }
  
        this.isLoading = false;
      },
      (error) => {
        console.error('Veri yüklenirken bir hata oluştu:', error);
        this.isLoading = false;
      }
    );
  }
  
  

  loadCategory(categoryId: number) {
    if (!categoryId) {
      console.error('Kategori ID undefined.');
      return;
    }
  
    this.categoryService.getByCategoryId(categoryId).subscribe(
      (response) => {
        // Yanıtın içindeki data'yı işleyin
        if (response && response.data) {
          const category = response.data; // Tek bir nesne
          this.categoryName = category.categoryName;
          this.superCategoryId = category.superCategoryId;
  
          if (this.superCategoryId) {
            this.loadSuperCategory(this.superCategoryId);
          } else {
            console.error('SuperCategory ID undefined.');
          }
        } else {
          console.error('Kategori bilgisi eksik veya hatalı.');
        }
      },
      (error) => {
        console.error('Kategoriler yüklenirken bir hata oluştu:', error);
      }
    );
  }
  
  
  
  
  

  loadSuperCategory(superCategoryId: number) {
    if (!superCategoryId) {
      console.error('SuperCategory ID undefined veya null.');
      return;
    }
  
    this.superCategoryService.getBySuperCategoryId(superCategoryId).subscribe(
      (response) => {

        if (response && response.data) {
          this.superCategoryName = response.data.superCategoryName;
        } else {
          console.error('Super Kategori bilgisi eksik veya hatalı.');
        }
  
        this.isLoading = false;
      },
      (error) => {
        console.error('Super Kategoriler yüklenirken bir hata oluştu:', error);
        this.isLoading = false;
      }
    );
  }
  
  

  loadColors() {
    this.colorService.getAll().subscribe((response) => {
      this.colors = response.data;
      this.isLoading = false; // Renkler yüklendikten sonra isLoading'i false yapıyoruz.
    }, error => {
      console.error('Renkler yüklenirken bir hata oluştu:', error);
      this.isLoading = false;
    });
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
                  file: "",
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
    } else if (image.file) {
      this.productImageService.deletePhoto(image.preview).subscribe(
        () => console.log(`Fotoğraf silindi: ${image.preview}`),
        (error) => console.error('Fotoğraf silme hatası:', error)
      );
    }

    this.temporaryImages.splice(index, 1);
  }


  addProduct() {
    // Nesneyi hazırlıyoruz
    const productStock: ProductStockAddDto = {
      ProductDetailsId: this.productDetail.ProductDetailsId,
      ProductId: this.paramProductId,
      ProductStocksId: this.productDetail.ProductStocksId,
      ProductColorId: Number(this.productDetail.ProductColorId),
      ProductSize: this.productDetail.ProductSize,
      Status: this.productDetail.Status,
      ProductCode: this.paramProductCode,
      UnitsInStock: this.productDetail.UnitsInStock,
      Images: this.temporaryImages.length > 0 ? this.temporaryImages.map(image => image.preview) : [],
    };
    // Verinin tam olarak hazır olup olmadığını kontrol et
    if (!productStock.ProductColorId) {
      alert('Lütfen bir renk seçiniz!');
      return;
    }
  
    if (!productStock.ProductSize || productStock.UnitsInStock === null || productStock.UnitsInStock < 1) {
      alert('Ürün Kodu, Boyut ve Stok miktarı zorunludur!');
      return;
    }
  
    // Eğer tüm veriler doğruysa, backend'e gönderelim
    this.isLoading = true;
  
    this.productService.productStockAdd(productStock).subscribe(
      (response) => {
        this.isLoading = false;
        let historyModel: ProductStatusHistoryModel = {
                      historyId: 0, // Backend tarafından otomatik oluşturulabilir
                      productStockId: 0, // Yeni eklenen stok ID burada kullanılırsa backend'den alınmalı
                      productId: this.paramProductId,
                      productDetailsId: 0, // Eğer productDetailsId kullanılacaksa backend'den alınmalı
                      status: true, // Başarılı işlem olduğu için true
                      changedBy: this.tokenInfo.userId , // Kullanıcı ID'si. Oturum açan kullanıcının ID'sini alabilirsiniz.
                      productCode: this.paramProductCode,
                      changedByFirstName: this.firstName, // Oturum açan kullanıcının adı alınabilir
                      changedByLastName: this.lastName, // Oturum açan kullanıcının soyadı alınabilir
                      email: this.tokenInfo.email, // Kullanıcı emaili
                      changeDate: new Date(), // Değişiklik tarihi
                      operations: "Ekleme", // İşlem türü
                      remarks: "Yeni stok eklendi", // İsteğe bağlı açıklama
                    };
        
                    this.productStatusHistoryService.add(historyModel).subscribe(
                      (historyResponse) => {
                        if (historyResponse.success) {
        
                        } else {
        
                        }
                      },
                      (historyError) => {
                        this.toastrService.error("Geçmiş kaydı sırasında bir hata oluştu.", "Hata");
                        console.error("Geçmiş kaydı hatası:", historyError);
                      }
                    );                                                                                                   
        this.router.navigate(['/product-operations', this.paramProductCode, this.paramProductId]);
      },
      (error) => {
        this.isLoading = false;
        console.error('Ürün eklerken hata oluştu:', error);
        console.error('Error details:', error.error); // Bu, hatanın detaylarını verir
        if (error.error && error.error.message) {
          this.toastrService.error(error.error.message);
        } else {
          this.toastrService.error('Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      }
    );    
  }  
  
  
  
  resetForm() {
    // Ürün detaylarını sıfırlıyoruz (disabled olanlar hariç)
  this.productDetail = {
    ...this.productDetail, // Mevcut nesneyi koru
    ProductDetailsId: 0,
      ProductId: 0,
      ProductColorId: 0,
      ProductStocksId: 0,
      ProductSize: '',
      Status: true,
      ProductCode: '',
      UnitsInStock: 0,
      Images: [],
  };

  // Fotoğrafları temizliyoruz (Mevcut fotoğraflar ve geçici fotoğraflar)
  this.temporaryImages = [];
  this.deletedImages = [];
  
  }

  cancelUpdate(productCode: string, productId: number) {
    this.router.navigate(['/product-operations', productCode,productId]);
  }
}
