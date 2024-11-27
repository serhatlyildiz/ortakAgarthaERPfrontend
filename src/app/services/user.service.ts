import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserWithRole } from '../models/userwithrole';
import { ResponseModel } from '../models/responseModel';
import { User } from '../models/user';
import { UserFilter } from '../models/userFilter';

@Injectable({
  providedIn: 'root', // Service, tüm uygulamada kullanılabilir olacak
})
export class UserService {
  private apiUrl = 'http://localhost:5038/api/Users';

  constructor(private http: HttpClient) {}

  // Kullanıcıları al
  getUsersWithRoles(): Observable<UserWithRole[]> {
    return this.http.get<UserWithRole[]>(`${this.apiUrl}/getallwithroles`);
  }

  // Kullanıcının rollerini al
  getRolesByUserId(userId: number): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/getrolesbyuserid?userId=${userId}`
    );
  }

  // Kullanıcıyı güncelle
  updateUser(userId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${userId}`, data);
  }

  // Kullanıcıyı sil
  updateUserStatus(userId: number): Observable<any> {
    let newPath = this.apiUrl + '/delete?userID=' + userId;
    return this.http.get<any>(newPath);
  }

  // Kullanıcıları filtreli olarak al
  getFilteredUsers(filters: any): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/getfilteredusers`, filters);
  }

}
