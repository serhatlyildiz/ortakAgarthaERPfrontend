import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductStocksService } from '../../services/product-stocks.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product: Product;
  productDetail: ProductDetailDto[] = [];
  isLoaded = false;
  images: string[] = [];
  currentIndex = 0;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productStocksService: ProductStocksService
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    this.getProductDetail(this.productId);
    this.getStocksByProductId(this.productId);
  }

  getProductDetail(id: number): void {
    console.log('Product Id: ', id);

    this.productService.getById(id).subscribe((response) => {
      this.product = response.data;
    });
  }

  getStocksByProductId(productId: number): void {
    this.productService
      .getProductStockDetailsByProduct(productId)
      .subscribe((response) => {
        this.productDetail = response.data;
        this.productDetail.forEach((element) => {
          this.images = this.images.concat(element.images);
        });
        this.isLoaded = true;
      });
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

}
