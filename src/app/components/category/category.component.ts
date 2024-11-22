import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
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
  categories: Category[] = [];
  currentCategory: Category;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((response) => {
      this.categories = response.data;
    });
  }
  setCurrentCategory(category: Category) {
    this.currentCategory = category;
  }

  getCurrentCategoryClass(category: Category) {
    if (category == this.currentCategory) {
      return 'has-children active';
    } else {
      return 'has-children';
    }
  }

  getAllCategoryClass() {
    if (!this.currentCategory) {
      return 'has-children active';
    } else {
      return 'has-children';
    }
  }
}
