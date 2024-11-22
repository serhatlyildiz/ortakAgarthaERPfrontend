import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserWithRole } from '../models/userwithrole';

@Injectable({
  providedIn: 'root' // Service, tüm uygulamada kullanılabilir olacak
})
export class UserService {
  private apiUrl = "http://localhost:5038/api/Users";

  constructor(private http: HttpClient) { }

  // Kullanıcıları al
  getUsersWithRoles(): Observable<UserWithRole[]> {
    return this.http.get<UserWithRole[]>(`${this.apiUrl}/getallwithroles`);
  }

  // Kullanıcının rollerini al
  getRolesByUserId(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getrolesbyuserid?userId=${userId}`);
  }

  // Kullanıcıyı güncelle
  updateUser(userId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${userId}`, data);
  }

  // Kullanıcıyı sil
  updateUserStatus(user: any): Observable<any> {
    const updatedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      city: user.city,
      district: user.district,
      adress: user.adress,
      status: user.status,  // Durum burada true/false olabilir
      cinsiyet: user.cinsiyet,
      
    };

    // API'ye veri gönderme (POST isteği)
    return this.http.post(`${this.apiUrl}/update`, updatedUser);
  }
}
