import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductDetailsService } from '../../services/product-details.service';
import { Colors } from '../../models/colors';
import { ProductDetailDto } from '../../models/ProductDetailDto';
import { ColorService } from '../../services/colors.service';
import { Product } from '../../models/product';
import { ProductDetails } from '../../models/productDetail';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product!: Product;
  productSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  availableSizes: string[] = [];
  colors: Colors[] = [];
  isLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productDetailsService: ProductDetailsService,
    private colorService: ColorService,
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    this.getProductDetail(this.productId);
    this.getAvailableSizes(this.productId);
    this.getColors();
  }

  getProductDetail(id: number): void {
    this.productService.getById(id).subscribe((response) => {
      this.product = response.data;
    });
  }

  getAvailableSizes(productId: number): void {
    this.productDetailsService.getAllByProductId(productId).subscribe((response) => {
      if (response && response.data) {
        this.availableSizes = response.data.map((item) => item.productSize);
      } else {
        this.availableSizes = [];
      }
      this.isLoaded = true;
    });
  }    

  getColors(): void {
    this.colorService.getAll().subscribe((response) => {
      this.colors = response.data;
    });
  }

  isSizeAvailable(size: string): boolean {
    return this.availableSizes.includes(size);
  }
}
