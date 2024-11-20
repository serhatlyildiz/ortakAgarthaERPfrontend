import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ilModel } from '../models/ilModel';
import { ilceModel } from '../models/ilceModel';

@Injectable({
  providedIn: 'root'
})
export class IlilceService {

  constructor(private http: HttpClient) { }

  // İlleri almak için metod
  getIllerr(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5038/api/Iller/getall');  // API URL'yi burada değiştirebilirsiniz
  }

  getIller(): Observable<ilModel> {
    return this.http.get<ilModel>('http://localhost:5038/api/Iller/getall');
  }
  

  // İlçeleri almak için metod
  getIlcelerr(ilId: number): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5038/api/Ilceler/getallbyillerid?ilId=${ilId}');  // API URL'yi burada değiştirebilirsiniz
  }

  getIlceler(ilId: number): Observable<ilceModel> { 
    return this.http.get<ilceModel>(`http://localhost:5038/api/Ilceler/getallbyillerid?ilId=${ilId}`);
  }  
}
