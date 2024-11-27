import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperationClaimsResponse } from '../models/operationClaims';


@Injectable({
  providedIn: 'root'
})
export class OperationClaimsService {
  private apiUrl = 'http://localhost:5038/api/OperationClaim';  // API URL

  constructor(private http: HttpClient) {}

  // Roller almak için GET isteği
  getRoles(): Observable<OperationClaimsResponse> {
    return this.http.get<OperationClaimsResponse>(`${this.apiUrl}/getall`);  // API endpoint'ini güncelledik
  }
}
