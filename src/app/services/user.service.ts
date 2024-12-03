import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserWithRole } from '../models/userwithrole';
import { UserForAdmin } from '../models/userForAdmin';
import { ResponseModel } from '../models/responseModel';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
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

  deleteUser(userID: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + '/delete?userID=' + userID;
    return this.http.get<ResponseModel>(newPath);
  }

  activateUser(userID: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + '/restore?userID=' + userID;
    return this.http.get<ResponseModel>(newPath);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/getbyid?id=' + id);
  }

  updateUser(user: UserForAdmin): Observable<any> {
    return this.http.post(this.apiUrl + '/update', user);
  }
  // Kullanıcıları filtreli olarak al
  getFilteredUsers(filters: any): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/getfilteredusers`, filters);
  }
}
