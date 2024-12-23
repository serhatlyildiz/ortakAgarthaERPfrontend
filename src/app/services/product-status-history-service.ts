import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { ProductStatusHistoryModel } from '../models/productStatusHistoryModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class ProductStatusHistoryService {

  apiUrl = 'http://localhost:5038/api/ProductStatusHistory';
    constructor(private http:HttpClient) { }

  getAll(): Observable<ListResponseModel<ProductStatusHistoryModel>>{
    return this.http.get<ListResponseModel<ProductStatusHistoryModel>>(
      '${this.apiUrl}/getall'
    );
  }



    add(productStatusHistory: ProductStatusHistoryModel): Observable<ResponseModel> {
      return this.http.post<ResponseModel>(`${this.apiUrl}/add`, productStatusHistory);
    }

    getProductStatusHistoryWithDetails(
      productStockId?: number,
      startDate?: Date,
      endDate?: Date,
      productCode?: string,
      operations?: string
    ): Observable<ListResponseModel<ProductStatusHistoryModel>> {
      let params = new HttpParams();
  
      if (productStockId) params = params.append('productStockId', productStockId.toString());
      if (startDate) params = params.append('startDate', startDate.toISOString());
      if (endDate) params = params.append('endDate', endDate.toISOString());
      if (productCode) params = params.append('productCode', productCode);
      if (operations) params = params.append('operations', operations);
  
      return this.http.get<ListResponseModel<ProductStatusHistoryModel>>(
        `${this.apiUrl}/getProductStatusHistoryWithDetails`,
        { params }
      );
    }

}
