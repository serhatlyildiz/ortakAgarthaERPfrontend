import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuperCategoryModel } from '../models/supercategory';
import { ListResponseModel } from '../models/listResponseModel';
import { CategoryModel } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class SuperCategoryService {

  apiUrl = 'http://localhost:5038/api/SuperCategory';
  constructor(private http:HttpClient) { }

  getAll(): Observable<ListResponseModel<SuperCategoryModel>>{
    return this.http.get<ListResponseModel<SuperCategoryModel>>(this.apiUrl + '/getall');
  }
}
