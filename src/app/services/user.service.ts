import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service, tüm uygulamada kullanılabilir olacak
})
export class UserService {
  private apiUrl = "http://localhost:5038/api/Users";

  constructor(private httpClient: HttpClient) { }

  // Kullanıcıları al
  getUsersWithRoles(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/getallwithroles`);
  }

  // Kullanıcının rollerini al
  getRolesByUserId(userId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/getrolesbyuserid?userId=${userId}`);
  }

  // Kullanıcıyı güncelle
  updateUser(userId: number, data: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/update/${userId}`, data);
  }

  // Kullanıcıyı sil
  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/delete/${userId}`);
  }
}
