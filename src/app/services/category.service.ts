import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { CategoryModel } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl = 'http://localhost:5038/api/categories';
  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<ListResponseModel<CategoryModel>> {
    return this.httpClient.get<ListResponseModel<CategoryModel>>(this.apiUrl + "/getall"); 
  }

   getBySuperCategoryId(superCategoryId: number): Observable<ListResponseModel<CategoryModel>> {
    return this.httpClient.get<ListResponseModel<CategoryModel>>(
      `${this.apiUrl}/getbysupercategoryid?superCategoryId=${superCategoryId}`
    );
  } 

  getByCategoryId(categoryId: number): Observable<CategoryModel> {
    return this.httpClient.get<CategoryModel>(
      `${this.apiUrl}/getbyid?categoryId=${categoryId}`
    );
  }
}