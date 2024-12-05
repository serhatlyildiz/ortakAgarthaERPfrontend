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

@Component({
  selector: 'app-product-stock-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-stock-update.component.html',
  styleUrls: ['./product-stock-update.component.css'],
})
export class ProductStockUpdateComponent implements OnInit {
  productDetail: ProductDetailDto = {
    productStockId: 0, // Bu alan kullanılmayacak
    productId: 0, // Bu alan kullanılmayacak
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

  constructor(
    private colorService: ColorService,
    private superCategoryService: SuperCategoryService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ){}

  ngOnInit(): void {
    this.loadProductDetails();
    this.loadColors();
    this.loadSuperCategories();  
  }

  loadProductDetails() {
    this.productService.getProductDetails().subscribe((response) => {
      // Ürün detayını burada alıp formda gösterebilirsiniz
      if (response.data && response.data.length > 0) {
        this.productDetail = response.data[0]; // İlk ürünü alalım
      }
    });
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
      // Seçilen üst kategoriye ait kategorileri getir
      this.categoryService.getBySuperCategoryId(superCategoryId).subscribe((response) => {
        this.categories = response.data;
      });
    } else {
      // Eğer üst kategori seçilmemişse kategori listesini temizle
      this.categories = [];
    }
  }

  // Event handler metotlar burada tanımlanabilir
  saveProduct() {
    console.log('Ürün kaydedildi:', this.productDetail);
  }
}
