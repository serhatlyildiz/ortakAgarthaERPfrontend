import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductImageService {
  private readonly apiUrl = 'http://localhost:5038/api/productimage'; // Backend API'nin temel URL'si

  constructor(private http: HttpClient) {}

  uploadPhoto(formData: FormData): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/upload`, formData); // FormData'yı POST isteği olarak gönderiyoruz
  }
}
