import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipePipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: ProductDetailDto[] = [];
  dataLoaded = false;
  filterText = '';
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  productIdForDetailPage: number;
  hoveredProductId: number | null = null;
  currentImageIndex: number = 0;

  @ViewChild('buttonElement') buttonElement!: ElementRef;
  @ViewChild('tooltipElement') tooltipElement!: ElementRef;
  sortCriteria: any;

  selectedCategory: number;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private sortService: SortService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productIdForDetailPage = +this.route.snapshot.paramMap.get('id')!;
    // URL parametrelerine göre ürünleri al
    this.activatedRoute.params.subscribe((params) => {
      if (params['categoryId']) {
        this.getProductsByCategory(params['categoryId']);
      } else {
        this.getProducts();
      }
    });

    // // Filtreleri dinle
    // this.filterService.filter$.subscribe((filters) => {
    //   this.applyFilters(filters);
    // });
  }

  goToProductDetail(productId: number): void {
    // ID'yi kaydet
    //localStorage.setItem('productId', productId.toString());

    // 10 dakika sonra silmek için timer ayarla
    /*
    setTimeout(() => {
      localStorage.removeItem('productId');
      console.log('Product ID silindi');
    }, 10 * 60 * 1000); // 10 dakika = 600,000 ms
    */
    // Detay sayfasına yönlendirme
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

  getProducts() {
    this.productService.getProductDetails2().subscribe((response) => {
      console.log('ürünler:', response.data);
      this.products = response.data;
      this.dataLoaded = true;
    });
  }

  getProductsByCategory(categoryId: number) {
    this.productService
      .getProductsByCategory(categoryId)
      .subscribe((response) => {
        if (response.success) {
          this.products = response.data;
          this.dataLoaded = true;
        }
      });
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

  previousImage(event: Event) {
    event.stopPropagation(); // Olayın yukarı iletilmesini durdur
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  // Bir sonraki resme geçiş
  nextImage(event: Event, imageCount: number) {
    event.stopPropagation(); // Olayın yukarı iletilmesini durdur
    if (this.currentImageIndex < imageCount - 1) {
      this.currentImageIndex++;
    }
  }
  // applyFilters(filters: any) {
  //   if (filters.category) {
  //     this.selectedCategory = filters.category;
  //     this.products = this.products.filter(
  //       (product) => product.categoryId === this.selectedCategory
  //     );
  //   }
  // }

  // // Kullanıcı tarafından filtrelerin ayarlanması
  // applyCategoryFilter(category: string) {
  //   const filters = {
  //     category: category,
  //   };
  //   this.filterService.setFilters(filters);
  // }
}
