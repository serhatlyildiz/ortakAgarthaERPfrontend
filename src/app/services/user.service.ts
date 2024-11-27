import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserWithRole } from '../models/userwithrole';
import { UserForAdmin } from '../models/userForAdmin';

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

  updateUserStatus(userId: number): Observable<any> {
    let newPath = this.apiUrl + '/delete?userID=' + userId;
    return this.http.get<any>(newPath);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/getbyid?id=' + id);
  }

  updateUser(user: UserForAdmin): Observable<any> {
    return this.http.post(this.apiUrl + '/update', user);
  }
}
