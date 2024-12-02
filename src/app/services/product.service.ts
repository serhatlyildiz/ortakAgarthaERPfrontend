import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Product } from '../models/product';
import { ResponseModel } from '../models/responseModel';
import { ProductDetailDto } from '../models/ProductDetailDto';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'http://localhost:5038/api/products';
  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<ListResponseModel<Product>> {
    let newPath = this.apiUrl + '/getall';
    return this.httpClient.get<ListResponseModel<Product>>(newPath);
  }

  getProductsByCategory(
    categoryId: number
  ): Observable<ListResponseModel<Product>> {
    let newPath =
      this.apiUrl + '/getBycategory?categoryId=' + categoryId;
    return this.httpClient.get<ListResponseModel<Product>>(newPath);
  }

  add(product: Product): Observable<ResponseModel> {
    const token = localStorage.getItem('token'); // Token'ı al
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'products/add',
      product,
      { headers }
    );
  }

  updateProductStatus(productId: number): Observable<any> {
    let newPath = this.apiUrl + '/delete?productID=' + productId;
    return this.httpClient.get<any>(newPath);
  }

  getProductDetails(): Observable<ProductDetailDto[]> {
    return this.httpClient.get<ProductDetailDto[]>(this.apiUrl + '/getproductdetails');
  }
}
