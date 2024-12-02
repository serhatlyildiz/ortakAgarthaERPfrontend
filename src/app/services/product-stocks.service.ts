import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { ProductStocks } from '../models/productStocks';

@Injectable({
  providedIn: 'root'
})
export class ProductStocksService {
  apiUrl = 'http://localhost:5038/api/productstocks';
  constructor(private http:HttpClient) { }

  getProducts(): Observable<ListResponseModel<ProductStocks>> {
    let newPath = this.apiUrl + '/getall';
    return this.http.get<ListResponseModel<ProductStocks>>(newPath);
  }

  getAllProductsByStock(
    productId: number
  ): Observable<ListResponseModel<ProductStocks>> {
    let newPath =
      this.apiUrl + 'getallbyproductid?=' + productId;
    return this.http.get<ListResponseModel<ProductStocks>>(newPath);
  }

  getByProductId(
    productId: number
  ): Observable<ListResponseModel<ProductStocks>> {
    let newPath =
      this.apiUrl + 'getbyproductid?=' + productId;
    return this.http.get<ListResponseModel<ProductStocks>>(newPath);
  }


}
