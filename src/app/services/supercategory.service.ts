import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuperCategoryModel } from '../models/supercategory';
import { ListResponseModel } from '../models/listResponseModel';
import { CategoryModel } from '../models/category';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class SuperCategoryService {

  apiUrl = 'http://localhost:5038/api/SuperCategory';
  constructor(private http:HttpClient) { }

  getAll(): Observable<ListResponseModel<SuperCategoryModel>>{
    return this.http.get<ListResponseModel<SuperCategoryModel>>(this.apiUrl + '/getall');
  }

  getBySuperCategoryId(superCategoryId: number): Observable<SingleResponseModel<SuperCategoryModel>> {
    return this.http.get<SingleResponseModel<SuperCategoryModel>>(
      `${this.apiUrl}/getbyid?superCategoryId=${superCategoryId}`
    );
  }   
}
