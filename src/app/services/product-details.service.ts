import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetails } from '../models/productDetail';
import { ListResponseModel } from '../models/listResponseModel';


@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  
  private apiUrl = 'http://localhost:5038/api/ProductDetails';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProductDetails[]> {
    return this.http.get<ProductDetails[]>(`${this.apiUrl}/getall`);
  }

  getById(productDetailsId: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.apiUrl}/getbyid?id=${productDetailsId}`);
  }

  getAllByProductId(productId: number): Observable<ListResponseModel<ProductDetails>> {
    return this.http.get<ListResponseModel<ProductDetails>>(`${this.apiUrl}/getallbyproductid?productId=${productId}`);
  }
  

  getAllByProductIdAndSize(productId: number, size: string): Observable<ListResponseModel<ProductDetails>> {
    return this.http.get<ListResponseModel<ProductDetails>>(
      `${this.apiUrl}/getallbyproductidandsize?productId=${productId}&productSize=${size}`
    );
  }
  

  add(productDetails: ProductDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, productDetails);
  }

  update(productDetails: ProductDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, productDetails);
  }

  delete(productDetailsId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/delete?productDetailsId=${productDetailsId}`);
  }
}
