import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { ProductDetails } from '../models/productDetail';
import { productDto } from '../models/productDto';
import { ProductDetailDto } from '../models/ProductDetailDto';
import { ProductDetailDto2 } from '../models/ProductDetailDto2';

@Injectable({
  providedIn: 'root'
})
export class ProductStocksService {
  apiUrl = 'http://localhost:5038/api/productstocks';
  constructor(private http:HttpClient) { }

  getProducts(): Observable<ListResponseModel<ProductDetails>> {
    let newPath = this.apiUrl + '/getall';
    return this.http.get<ListResponseModel<ProductDetails>>(newPath);
  }

  getAllProductsByStock(
    productId: number
  ): Observable<ListResponseModel<ProductDetails>> {
    let newPath =
      this.apiUrl + 'getallbyproductid?=' + productId;
    return this.http.get<ListResponseModel<ProductDetails>>(newPath);
  }

  getByProductId(
    productId: number
  ): Observable<ListResponseModel<ProductDetails>> {
    let newPath =
      this.apiUrl + 'getbyproductid?=' + productId;
    return this.http.get<ListResponseModel<ProductDetails>>(newPath);
  }

  deleteProductStock(productIdStockId: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + '/delete?productStockId=' + productIdStockId;
    return this.http.get<ResponseModel>(newPath);
  }

  
  getAllByProductDetailsIdAndColor(
    productDetailsId: number,
    productColorId: number
  ): Observable<ProductDetailDto[]> { // Dönüş tipini güncelledik
    const url = `${this.apiUrl}/getallbyproductdetailsidandcolor?productDetailsId=${productDetailsId}&productColorId=${productColorId}`;
    return this.http.get<ProductDetailDto[]>(url); // Doğrudan dizi döndürüyoruz
  }  

  getAllByProductDetailsId(productDetailsId: number): Observable<ProductDetailDto2[]> {
    return this.http.get<ProductDetailDto2[]>(
      `${this.apiUrl}/getallbyproductdetailsid?productDetailsId=${productDetailsId}`
    );
  }
  

}
