import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SuperCategoryService } from '../../services/supercategory.service';
import { CategoryService } from '../../services/category.service';
import { SuperCategoryModel } from '../../models/supercategory';
import { CategoryModel } from '../../models/category';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit {
  productAddForm: FormGroup;
  superCategories: SuperCategoryModel[] = [];
  categories: CategoryModel[] = [];
  selectedSuperCategoryId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private toastrService: ToastrService,
    private superCategoryService: SuperCategoryService,
    private categoryService: CategoryService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.loadSuperCategories();
    this.createProductAddForm();
    
  }
  
  // SuperCategories'ı Yükle
  loadSuperCategories() {
    this.superCategoryService.getAll().subscribe(
      (response) => {
        if (response.success) {
          this.superCategories = response.data;
        } else {
          this.toastrService.error('Kategoriler yüklenemedi.', 'Hata');
        }
      },
      (error) => {
        this.toastrService.error('Kategoriler yüklenirken bir hata oluştu.', 'Hata');
      }
    );
  }

  // SuperCategory değiştiğinde Categoryleri Yükle
  onSuperCategoryChange(superCategoryId: number) {
    this.selectedSuperCategoryId = superCategoryId;
    if (superCategoryId) {
      this.categoryService.getBySuperCategoryId(superCategoryId).subscribe(
        (response) => {
          this.categories = response.data;
        },
        (error) => {
          this.toastrService.error('Kategoriler yüklenirken bir hata oluştu.', 'Hata');
        }
      );
    } else {
      this.categories = [];
    }
  }

  // Formu oluştur
  createProductAddForm() {
    this.productAddForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(2)]],
      superCategoryId: ['', Validators.required],  // SuperCategory ID
      categoryId: ['', Validators.required],  // Category ID
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      productCode: ['', [Validators.required]] // productCode alanını buraya ekleyin
    });
  }

  // Ürün ekle
  add() {
    console.log(this.productAddForm.value);
    if (this.productAddForm.valid) {
      // Form verisini alıyoruz
      let productModel: Product = { 
        productId: 0, // Eğer API productId istemiyorsa, backend'de yok sayılabilir.
        categoryId: Number(this.productAddForm.value.categoryId), // string -> number dönüşümü
        productName: this.productAddForm.value.productName,
        productDescription: this.productAddForm.value.description,
        unitPrice: this.productAddForm.value.unitPrice,
        Status: true, // Backend büyük harf ile istiyor
        productCode: this.productAddForm.value.productCode
      };
  
      console.log("Gönderilen model:", productModel);
  
      // Son olarak, API'ye yeni objeyi gönderiyoruz
      this.productService.productAdd(productModel).subscribe(
        (response) => {
          if (response.success) {
            this.toastrService.success(response.message, 'Başarılı');
            this.route.navigate(["product-stock-op"]);
          } else {
            this.toastrService.error(response.message, 'Hata');
          }
        },
        (responseError) => {
          const errorMessage = responseError?.error?.message || 'Bilinmeyen bir hata oluştu.';
          console.error("Hata detayı:", responseError); // Hata detayını konsola yazdır
          this.toastrService.error(errorMessage, 'Hata');
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik', 'Dikkat');
    }
  }  

  productStockOp(): void{
    this.route.navigate(["/product-stock-op"]);
  }
  
}
