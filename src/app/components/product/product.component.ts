import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPipePipe } from '../../pipes/filter-pipe.pipe';
import { CartService } from '../../services/cart.service';
import { createPopper } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';
import { SortService } from '../../services/sort.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { ProductDetailDto2 } from '../../models/ProductDetailDto2';
import { CategoryService } from '../../services/category.service';
import { response } from 'express';
import { SuperCategoryService } from '../../services/supercategory.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipePipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: ProductDetailDto2[] = [];
  dataLoaded = false;
  filterText = '';
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  productIdForDetailPage: number;
  hoveredProductId: number | null = null;
  currentImageIndex: number = 0;
   superCategoryId: number | null = null;
  categoryId: number | null = null;

  @ViewChild('buttonElement') buttonElement!: ElementRef;
  @ViewChild('tooltipElement') tooltipElement!: ElementRef;
  @Input() superCategoryName?: string;
  @Input() categoryName?: string;
  sortCriteria: any;

  selectedCategory: number;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private sortService: SortService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private superCategoryService: SuperCategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.superCategoryId = params['superCategoryId']
        ? +params['superCategoryId']
        : null;
      this.categoryId = params['categoryId'] ? +params['categoryId'] : null;
  
      if (this.superCategoryId && this.categoryId) {
        // Hem superCategoryId hem categoryId varsa
        this.superCategoryService.getBySuperCategoryId(this.superCategoryId).subscribe((response) => {
          this.superCategoryName = response.data.superCategoryName; // `response.d` yerine doğru alanı kullanın, genellikle `response.data` olur.
        });
        this.categoryService.getByCategoryId(this.categoryId).subscribe((response) => {
          this.categoryName = response.data.categoryName; // `response.d` yerine doğru alanı kullanın, genellikle `response.data` olur.
        });
        this.getProductsByCategory(this.superCategoryId, this.categoryId);
      } else if (this.superCategoryId) {
        this.superCategoryService.getBySuperCategoryId(this.superCategoryId).subscribe((response) => {
          this.superCategoryName = response.data.superCategoryName; // `response.d` yerine doğru alanı kullanın, genellikle `response.data` olur.
        });
        // Sadece superCategoryId varsa
        this.getProductsBySuperCategory(this.superCategoryId);
      } else {
        // Hiçbiri yoksa tüm ürünleri al
        this.getProducts();
      }
      this.getCategoryDisplay();
    });
  }
  
  getCategoryDisplay(): boolean {
    return !!this.superCategoryName || !!this.categoryName; // SuperCategory veya Category varsa göster
  }
  
  onSuperCategoryClick(): void {
    if (this.superCategoryName) {
      // SuperCategory'ye tıklanırsa yapılacak işlem (örn: sayfa yenileme)
       // Sayfayı yenile
      if(this.categoryName === null){
        location.reload();
      }
      else{
        this.router.navigate(["products/",this.superCategoryId]);
      }
    }
  }

  getProducts() {
    this.productService.getProductDetails2().subscribe((response) => {
      this.products = response.data.map((product) => ({
        ...product,
        currentImageIndex: 0, // Varsayılan olarak her ürünün indeksi 0
      }));
      this.dataLoaded = true;
    });
  }

  getProductsBySuperCategory(superCategoryId: number) {
    this.productService
      .getProductsBySuperCategory(superCategoryId)
      .subscribe((response) => {
        this.products = response.data.map((product) => ({
          ...product,
          currentImageIndex: 0, // Varsayılan olarak her ürünün indeksi 0
        }));
        this.dataLoaded = true;
      });
  }
  
  getProductsByCategory(superCategoryId: number, categoryId: number) {
    this.productService
      .getProductsByCategory(superCategoryId, categoryId)
      .subscribe((response) => {
        this.products = response.data.map((product) => ({
          ...product,
          currentImageIndex: 0, // Varsayılan olarak her ürünün indeksi 0
        }));
        this.dataLoaded = true;
      });
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  ngAfterViewInit() {
    if (this.buttonElement && this.tooltipElement) {
      createPopper(
        this.buttonElement.nativeElement,
        this.tooltipElement.nativeElement,
        {
          placement: 'top', // Tooltip'in konumu
        }
      );
    }
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      // Aynı kolona basılmışsa sıralama yönünü değiştir
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Farklı bir kolona basılmışsa, bu kolona göre sıralamaya başla
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    // Sıralama işlemini gerçekleştir
    this.products = this.sortService.sortByKey(
      this.products,
      column as keyof (typeof this.products)[0],
      this.sortOrder
    );
  }

  previousImage(event: Event, product: ProductDetailDto2) {
    event.stopPropagation(); // Olayın yukarı iletilmesini durdur
    if (product.currentImageIndex! > 0) {
      product.currentImageIndex!--;
    }
  }
  
  nextImage(event: Event, product: ProductDetailDto2) {
    event.stopPropagation(); // Olayın yukarı iletilmesini durdur
    if (product.currentImageIndex! < product.images.length - 1) {
      product.currentImageIndex!++;
    }
  }
}
