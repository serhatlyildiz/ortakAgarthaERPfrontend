import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Product } from '../models/product';
import { ResponseModel } from '../models/responseModel';
import { ProductDetailDto } from '../models/ProductDetailDto';
import { ProductFilterModel } from '../models/productfiltermodel';

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
  ): Observable<ListResponseModel<ProductDetailDto>> {
    let newPath = this.apiUrl + '/getBycategory?categoryId=' + categoryId;
    return this.httpClient.get<ListResponseModel<ProductDetailDto>>(newPath);
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

  deleteProduct(productId: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + '/delete?productID=' + productId;
    return this.httpClient.get<ResponseModel>(newPath);
  }

  activateProduct(productId:number): Observable<ResponseModel>{
    let newPath = this.apiUrl + "/restore?productID=" + productId;
    return this.httpClient.get<ResponseModel>(newPath)
  }

  getProductDetails(): Observable<ListResponseModel<ProductDetailDto>> {
    return this.httpClient.get<ListResponseModel<ProductDetailDto>>(
      this.apiUrl + '/getproductdetails'
    );
  }

  filterProducts(filter: ProductFilterModel): Observable<ListResponseModel<ProductDetailDto>> {
    let newPath = this.apiUrl + '/filter';
    return this.httpClient.post<ListResponseModel<ProductDetailDto>>(newPath, filter);
  }
  
}
