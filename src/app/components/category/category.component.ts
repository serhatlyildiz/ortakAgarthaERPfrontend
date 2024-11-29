import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: CategoryModel[] = [];
  currentCategory: CategoryModel;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((response) => {
      this.categories = response.data;
    });
  }
  setCurrentCategory(category: CategoryModel) {
    this.currentCategory = category;
  }

  getCurrentCategoryClass(category: CategoryModel) {
    if (category == this.currentCategory) {
      return 'has-children active';
    } else {
      return 'has-children';
    }
  }

  loadCategoriesBySuperCategoryId(superCategoryId: number) {
    this.categoryService.getBySuperCategoryId(superCategoryId).subscribe((response) => {
      this.categories = response.data;
    });
  }
  

  getAllCategoryClass() {
    if (!this.currentCategory) {
      return 'has-children active';
    } else {
      return 'has-children';
    }
  }
}
