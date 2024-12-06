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
  temporaryImages: { file: File | null; preview: string; isNew: boolean }[] = []; // Yeni veya mevcut fotoğraflar
  deletedImages: string[] = []; // Silinen fotoğrafların yolları


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
  
        // Fotoğrafları veritabanından yükle
        this.loadPhotosFromDatabase();
      } else {
        console.error('No product details found for the given productStockId.');
      }
    });
  }
  
  loadPhotosFromDatabase() {
    // Veritabanından gelen fotoğraf yolları (örnek olarak)
    const databasePhotos: string[] = this.productDetail.images || [];
  
    // Fotoğrafları geçici dizide saklayalım
    this.temporaryImages = databasePhotos.map((photoPath) => ({
      file: null,          // Fotoğraf dosyası başlangıçta null
      preview: photoPath,  // Veritabanındaki yol
      isNew: false,        // Bu fotoğraf veritabanında var, yeni değil
    }));
  
    // Konsola geçici fotoğrafları yazdır
    console.log('Preview:', this.temporaryImages);
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

  selectFiles() {
    this.fileInput.nativeElement.click();
  }
  
  onFilesSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.temporaryImages.push({
          file: file,
          preview: reader.result as string,
          isNew: true, // Yeni fotoğraf olduğunu işaretliyoruz
        });
        // Klasöre kopyalama işlemi
        this.copyToFolder(file);
      };
      reader.readAsDataURL(file);
    }
  }

 // Fotoğrafı Listeden Kaldırma
 removeFile(index: number) {
  const image = this.temporaryImages[index];
  if (!image.isNew) {
    // Mevcut fotoğraflar için silme işlemi
    this.deletedImages.push(image.preview);
  } else {
    // Yeni eklenen ama kaydedilmemiş dosyalar için klasörden silme
    if (image.file) this.deleteFromFolder(image.file.name);
  }
  this.temporaryImages.splice(index, 1);
}

copyToFolder(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  // Backend API'ye gönderim örneği
  console.log('Klasöre kopyalanan dosya:', file.name);
  // API çağrısı yapılabilir: this.http.post('api/upload', formData).subscribe();
}

deleteFromFolder(fileName: string) {
  console.log('Klasörden silinen dosya:', fileName);
  // API çağrısı yapılabilir: this.http.delete(`api/delete/${fileName}`).subscribe();
}

  // Fotoğrafları Kaydetme
  saveChanges() {
    const newImages = this.temporaryImages
      .filter((img) => img.isNew)
      .map((img) => img.file);

    const removedImages = this.deletedImages;

    console.log('Yeni Fotoğraflar:', newImages);
    console.log('Silinen Fotoğraflar:', removedImages);

    // API ile veritabanına kaydetme işlemi
    // this.http.post('api/save', { newImages, removedImages }).subscribe();
  }
}
  
