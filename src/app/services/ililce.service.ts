import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ilModel } from '../models/ilModel';
import { ilceModel } from '../models/ilceModel';
import { ilModels } from '../models/ilModels';
import { ilceModels } from '../models/ilceModels';

@Injectable({
  providedIn: 'root'
})
export class IlilceService {

  constructor(private http: HttpClient) { }

  getIller(): Observable<ilModel> {
    return this.http.get<ilModel>('http://localhost:5038/api/Iller/getall');
  }

  getIlceler(ilId: number): Observable<ilceModel> { 
    return this.http.get<ilceModel>(`http://localhost:5038/api/Ilceler/getallbyillerid?ilId=${ilId}`);
  }  

  getByIdIl(id: number): Observable<ilModels> {
    return this.http.get<ilModels>(`http://localhost:5038/api/Iller/getbyid?id=${id}`);
  } 
  
  getByIdIlce(id: number): Observable<ilceModels> {
    return this.http.get<ilceModels>(`http://localhost:5038/api/Ilceler/getbyid?id=${id}`);
  } 
}
