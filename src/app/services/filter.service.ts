import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterSubject = new BehaviorSubject<any>({});
  filter$ = this.filterSubject.asObservable();

  constructor() {}

  // Filtreleri güncelleme metodu
  setFilters(filters: any) {
    this.filterSubject.next(filters);
  }

  // Mevcut filtreleri alma metodu
  getFilters() {
    return this.filterSubject.value;
  }
}
