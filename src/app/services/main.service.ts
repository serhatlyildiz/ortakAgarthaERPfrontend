import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalahModel } from '../models/salahModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private httpClient: HttpClient) {}

  loadSalah(): Observable<SingleResponseModel<SalahModel>> {
    return this.httpClient.get<SingleResponseModel<SalahModel>>(
      'http://localhost:5038/api/helper/get-salah-time'
    );
  }
}
