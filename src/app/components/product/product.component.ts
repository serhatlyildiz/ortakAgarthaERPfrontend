/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, } from '@angular/router';
import { VatAddedPipe } from "../../pipes/vat-added.pipe";
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FilterPipePipe } from '../../pipes/filter-pipe.pipe';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true, 
  imports: [ CommonModule, VatAddedPipe, FormsModule, RouterOutlet, FilterPipePipe, 
    ToastrModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  dataLoaded = false;
  filterText = "";

  constructor(private productService: ProductService,
   private activatedRoute:ActivatedRoute, 
   private toastrService:ToastrService, 
   private cartService:CartService ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      if(params["categoryId"]){
        this.getProductsByCategory(params["categoryId"])
      }else{
        this.getProducts()
      }
    })

  }

  getProducts() {
    this.productService.getProducts().subscribe(response=>{
        this.products = response.data;
        this.dataLoaded = true;
    });
  }

  getProductsByCategory(categoryId:number) {
    this.productService.getProductsByCategory(categoryId).subscribe(response=>{
      if(response.success){
        this.products = response.data;
        this.dataLoaded = true;
        this.toastrService.success(response.message)
      }
        
    });
  }

  addToCart(product:Product){
    if(product.productId===1){
      this.toastrService.error("Bu ürün sepete eklenemez", "HATA")
    }else{
      this.toastrService.success("Sepete eklendi", product.productName)
      this.cartService.addToCart(product);
    }
  }
}
*/

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { VatAddedPipe } from "../../pipes/vat-added.pipe";
import { FormsModule } from '@angular/forms';
import { FilterPipePipe } from '../../pipes/filter-pipe.pipe';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-product',
  standalone: true, 
  imports: [
    CommonModule,
    VatAddedPipe,
    FormsModule,
    FilterPipePipe,
    ToastrModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  dataLoaded = false;
  filterText = "";

  @ViewChild('buttonElement') buttonElement!: ElementRef;
  @ViewChild('tooltipElement') tooltipElement!: ElementRef;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute, 
    private toastrService: ToastrService, 
    private cartService: CartService 
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['categoryId']) {
        this.getProductsByCategory(params['categoryId']);
      } else {
        this.getProducts();
      }
    });
  }

  ngAfterViewInit() {
    if (this.buttonElement && this.tooltipElement) {
      createPopper(this.buttonElement.nativeElement, this.tooltipElement.nativeElement, {
        placement: 'top', // Tooltip'in konumu
      });
    }
  }

  getProducts() {
    this.productService.getProducts().subscribe(response => {
      this.products = response.data;
      this.dataLoaded = true;
    });
  }

  getProductsByCategory(categoryId: number) {
    this.productService.getProductsByCategory(categoryId).subscribe(response => {
      if (response.success) {
        this.products = response.data;
        this.dataLoaded = true;
        //this.toastrService.success(response.message);
      }
    });
  }

  addToCart(product: Product) {
    if (product.productId === 1) {
      this.toastrService.error("Bu ürün sepete eklenemez", "HATA");
    } else {
      this.toastrService.success("Sepete eklendi", product.productName);
      this.cartService.addToCart(product);
    }
  }
}
