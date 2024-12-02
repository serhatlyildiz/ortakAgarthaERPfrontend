import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Colors } from '../models/colors';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  apiUrl = 'http://localhost:5038/api/colors';
  constructor(private http:HttpClient) { }

  getAll(): Observable<ListResponseModel<Colors>> {
    return this.http.get<ListResponseModel<Colors>>(this.apiUrl + "/getall"); 
  }

  getByColorId(superCategoryId: number) {
    return this.http.get<{ data: Colors[] }>(this.apiUrl + '/getbyid');
  }
}
