import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryModel } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { SuperCategoryService } from '../../services/supercategory.service';
import { SuperCategoryModel } from '../../models/supercategory';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navi',
  standalone: true,
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
  imports: [RouterModule, CommonModule],
})
export class NaviComponent implements OnInit {
  categories: CategoryModel[] = [];
  superCategories: SuperCategoryModel[] = [];
  filteredCategories: CategoryModel[] = [];
  username: string = '';
  loginForm: FormGroup;
  cartItemCount: number = 0;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private superCategoryService: SuperCategoryService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getSuperCategories();
    this.getCategories();
    if (this.authService.isAuthenticated()) {
      this.username = this.authService.getUsername();
    }
    // this.cartService.getCartItemCount().subscribe((count) => {
    //   this.cartItemCount = count;
    // });
  }

  isAdmin() {
    return this.authService.hasRole(['admin']);
  }

  getSuperCategories() {
    this.superCategoryService.getAll().subscribe((response) => {
      this.superCategories = response.data;
    });
  }

  loadCategoriesBySuperCategoryId(superCategoryId: number) {
    this.filteredCategories = this.categories.filter(
      (category) => category.superCategoryId === superCategoryId
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((response) => {
      this.categories = response.data;
    });
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.router.navigate(['register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCart() {
    this.router.navigate(['/cart-summary']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  navigateToProducts(superCategoryId: number, categoryId?: number) {
    if (categoryId) {
      // Hem superCategoryId hem categoryId ile yönlendirme
      this.router.navigate(['/products', superCategoryId, categoryId]);
    } else {
      // Sadece superCategoryId ile yönlendirme
      this.router.navigate(['/products', superCategoryId]);
    }
  }

  /*
  productAdd(){
    this.router.navigate(['/product-stock-op']);
  }

  productUpdated(){
    this.router.navigate(['/product-operations',"navi"]);
  }
    */
}
