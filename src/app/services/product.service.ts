import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Product } from '../models/product';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl = 'http://localhost:5038/api/';
  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<ListResponseModel<Product>> {
    let newPath = this.apiUrl + "products/getall"
    return this.httpClient.get<ListResponseModel<Product>>(newPath); 
  }

  getProductsByCategory(categoryId:number): Observable<ListResponseModel<Product>> {
    let newPath = this.apiUrl + "products/getBycategory?categoryId="+categoryId
    return this.httpClient.get<ListResponseModel<Product>>(newPath); 
  }

  /*
  add(product:Product):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"products/add",product)
  }
    */

  add(product: Product): Observable<ResponseModel> {
    const token = localStorage.getItem("token"); // Token'ı al
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.httpClient.post<ResponseModel>(this.apiUrl + "products/add", product, { headers });
  }
  

}
