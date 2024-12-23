import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Product } from '../models/product';
import { ResponseModel } from '../models/responseModel';
import { ProductDetailDto } from '../models/ProductDetailDto';
import { ProductFilterModel } from '../models/productfiltermodel';
import { productDto } from '../models/productDto';
import { ProductStockAddDto } from '../models/productStockAddDto';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ProductDetailDto2 } from '../models/ProductDetailDto2';
import { ProductWithTotalStockDto } from '../models/producWithTotalStockDto';

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

  // getById(productId: number): Observable<any> {
  //   return this.httpClient.get(
  //     this.apiUrl + '/getbyid?id='+productId
  //   );
  // }

  // getProductsByCategory(
  //   categoryId: number
  // ): Observable<ListResponseModel<ProductDetailDto>> {
  //   let newPath = this.apiUrl + '/getBycategory?categoryId=' + categoryId;
  //   return this.httpClient.get<ListResponseModel<ProductDetailDto>>(newPath);
  // }

  add(product: Product): Observable<ResponseModel> {
    const token = localStorage.getItem('token'); // Token'ı al
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.post<ResponseModel>(this.apiUrl + '/add', product, {
      headers,
    });
  }

  productAdd(product: Product): Observable<ResponseModel> {
    const token = localStorage.getItem('token'); // Token'ı al
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.post<ResponseModel>(this.apiUrl + '/productadd', product, { headers });
  }

  productStockAdd(productStock: ProductStockAddDto): Observable<ResponseModel> {
    const token = localStorage.getItem('token'); // Token'ı al
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.post<ResponseModel>(this.apiUrl + '/productstockadd', productStock, { headers });

  }

  deleteProduct(productId: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + '/delete?productID=' + productId;
    return this.httpClient.get<ResponseModel>(newPath);
  }

  activateProduct(productId: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + '/restore?productID=' + productId;
    return this.httpClient.get<ResponseModel>(newPath);
  }

  getProductDetails(): Observable<ListResponseModel<ProductDetailDto>> {
    return this.httpClient.get<ListResponseModel<ProductDetailDto>>(
      this.apiUrl + '/getproductdetails'
    );
  }

  getProductDetails2(): Observable<ListResponseModel<ProductDetailDto2>> {
    return this.httpClient.get<ListResponseModel<ProductDetailDto2>>(
      this.apiUrl + '/getproductdetails2'
    );
  }

  getByProductDetails(productStocksId: number): Observable<any> {
    return this.httpClient.get(
      this.apiUrl + '/getproductstockdetails?productStockId=' + productStocksId
    );
  }

  getByProductCodeForProductDto(productCode: string): Observable<any> {
    return this.httpClient.get(
      this.apiUrl + '/getproductstockdetails?productCode=' + productCode
    );
  }

  filterProducts(
    filters: any
  ): Observable<ListResponseModel<ProductDetailDto>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<ListResponseModel<ProductDetailDto>>(
      `${this.apiUrl}/filter`,
      filters,
      { headers }
    );
  }

  update(
    product: any,
    productDetails: any,
    productStocks: any
  ): Observable<ResponseModel> {
    const token = localStorage.getItem('token'); // Token'ı al
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<ResponseModel>(
      `${this.apiUrl}/update?productId=${product.productId}&productDetailsId=${productDetails.productDetailsId}&productStocksId=${productStocks.productStocksId}`,
      { product, productDetails, productStocks },
      { headers }
    );
  }

  getProductDto(): Observable<ListResponseModel<productDto>> {
    return this.httpClient.get<ListResponseModel<productDto>>(
      this.apiUrl + '/getproductdto'
    );
  }

  getProductStockDetailsByProduct(
    productId: number
  ): Observable<ListResponseModel<ProductDetailDto>> {
    return this.httpClient.get<ListResponseModel<ProductDetailDto>>(
      this.apiUrl +
        '/get-product-stock-details-by-product?productId=' +
        productId
    );
  }

  getById(productId: number): Observable<SingleResponseModel<Product>> {
    return this.httpClient.get<SingleResponseModel<Product>>(
      this.apiUrl + '/getbyid?id=' + productId
    );
  }

  getProductsWithTotalStock(): Observable<SingleResponseModel<ProductWithTotalStockDto[]>> {
    return this.httpClient.get<SingleResponseModel<ProductWithTotalStockDto[]>>(
        `${this.apiUrl}/getproductswithtotalstock`
    );
}

getProductsBySuperCategory(
  superCategoryId: number
): Observable<{ data: ProductDetailDto2[] }> {
  return this.httpClient.get<{ data: ProductDetailDto2[] }>(
    `${this.apiUrl}/getbycategoryidproductdetails2?superCategoryId=${superCategoryId}`
  );
}

getProductsByCategory(
  superCategoryId: number,
  categoryId: number
): Observable<{ data: ProductDetailDto2[] }> {
  return this.httpClient.get<{ data: ProductDetailDto2[] }>(
    `${this.apiUrl}/getbycategoryidproductdetails2?superCategoryId=${superCategoryId}&categoryId=${categoryId}`
  );
}

  /*
  filterProducts(filters: any): Observable<ListResponseModel<ProductDetailDto>> {
    return this.httpClient.post<ListResponseModel<ProductDetailDto>>(
      'http://localhost:5038/api/products/filters',
      filters
    );
  }
    */
}
