import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class registerService {
  constructor(private http: HttpClient) {}

  register(userForRegisterDto: User): Observable<any> {
    console.log(userForRegisterDto.adress);
    console.log(userForRegisterDto.city);
    return this.http.post(`http://localhost:5038/api/Auth/register`, userForRegisterDto);
  }
}
