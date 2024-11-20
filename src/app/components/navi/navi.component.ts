import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-navi',
  standalone: true,
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
  imports: [CategoryComponent, RouterModule],
})
export class NaviComponent implements OnInit {
  categories: Category[] = [];
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((response) => {
      this.categories = response.data;
    });
  }

  login() {
    this.router.navigate(['login']);
  }
}