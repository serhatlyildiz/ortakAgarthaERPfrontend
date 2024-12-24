import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { ProductStatusHistoryModel } from '../models/productStatusHistoryModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

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

  getAllDto(): Observable<ListResponseModel<ProductStatusHistoryModel>> {
    return this.http.get<ListResponseModel<ProductStatusHistoryModel>>(
      `${this.apiUrl}/getalldto`  // 'getalldto' endpointine istek gönderiyoruz
    );
  }
  

    add(productStatusHistory: ProductStatusHistoryModel): Observable<ResponseModel> {
      return this.http.post<ResponseModel>(`${this.apiUrl}/add`, productStatusHistory);
    }

    getProductStatusHistoryWithDetails(
      userEmail?: string,
      startDate?: string,  // string türünde tarih
      endDate?: string,    // string türünde tarih
      productCode?: string,
      operations?: string
    ): Observable<SingleResponseModel<ProductStatusHistoryModel[]>> { 
      let params = new HttpParams();
      
      if (userEmail) params = params.append('userEmail', userEmail);
      if (startDate) params = params.append('startDate', startDate);  // ISO string formatı gönderiyoruz
      if (endDate) params = params.append('endDate', endDate);        // ISO string formatı gönderiyoruz
      if (productCode) params = params.append('productCode', productCode);
      if (operations) params = params.append('operations', operations);
    
      return this.http.get<SingleResponseModel<ProductStatusHistoryModel[]>>(
        `${this.apiUrl}/getProductStatusHistoryWithDetails`, 
        { params }
      );
    }    
}
