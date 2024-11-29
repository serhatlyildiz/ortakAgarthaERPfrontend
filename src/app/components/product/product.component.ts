import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { VatAddedPipe } from "../../pipes/vat-added.pipe";
import { FormsModule } from "@angular/forms";
import { FilterPipePipe } from "../../pipes/filter-pipe.pipe";
import { Product } from "../../models/product";
import { ProductService } from "../../services/product.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CartService } from "../../services/cart.service";
import { SortService } from "../../services/sort.service";
import { createPopper } from "@popperjs/core";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, VatAddedPipe, FormsModule, FilterPipePipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  dataLoaded = false;
  filterText = '';
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';

  @ViewChild('buttonElement') buttonElement!: ElementRef;
  @ViewChild('tooltipElement') tooltipElement!: ElementRef;
  sortCriteria: any;

  selectedCategory: number;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private cartService: CartService,
    private sortService: SortService,
  ) {}

  ngOnInit(): void {
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
    this.productService.getProducts().subscribe((response) => {
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

  addToCart(product: Product) {
    if (product.productId === 1) {
      this.toastrService.error('Bu ürün sepete eklenemez', 'HATA');
    } else {
      this.toastrService.success('Sepete eklendi', product.productName);
      this.cartService.addToCart(product);
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



  toggleStatus(product: any): void {
    const productId = product.id; // Kullanıcı ID'sini al

    // Durum güncellemesi API çağrısı
    this.productService.updateProductStatus(productId).subscribe({
      next: (response) => {
        product.status = !product.status; // Durumu tersine çevir
        const statusMessage = product.status ? 'Aktif edildi' : 'Silindi';
        this.toastrService.success(`Kullanıcı başarıyla ${statusMessage}.`);
        console.log('Kullanıcı durumu güncellendi:', response);
      },
      error: (err) => {
        console.error('Durum güncellemesi başarısız:', err);
        this.toastrService.error('Durum güncelleme işlemi başarısız.');
      },
    });
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
