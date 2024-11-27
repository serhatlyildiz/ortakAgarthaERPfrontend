import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiUrl = 'http://localhost:5038/api/OperationClaim';

  constructor(private httpClient: HttpClient) {}

  getRoles(): Observable<ListResponseModel<Role>> {
    return this.httpClient.get<ListResponseModel<Role>>(
      this.apiUrl + '/getall'
    );
  }
}
