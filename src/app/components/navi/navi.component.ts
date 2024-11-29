import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { CategoryModel } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { SuperCategoryService } from '../../services/supercategory.service';
import { response } from 'express';
import { SuperCategoryModel } from '../../models/supercategory';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navi',
  standalone: true,
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
  imports: [CategoryComponent, RouterModule, CommonModule,],
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
    public authService: AuthService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.getSuperCategories();
    this.getCategories();
    if (this.authService.isAuthenticated()){
      this.username = this.authService.getUsername();
    }
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  isAdmin() {
    return this.authService.hasRole(['admin']); // Admin rolüne sahip olup olmadığını kontrol et
  }

  getSuperCategories(){
    this.superCategoryService.getAll().subscribe((response) => {
      this.superCategories = response.data;
    })
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


}
