import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  sort<T>(items: T[], compareFn: (a: T, b: T) => number): T[] {
    return items.sort(compareFn);
  }

  sortByKey<T>(items: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return items.sort((a, b) => {
      const comparison = this.compareValues(a[key], b[key]);
      return order === 'asc' ? comparison : -comparison;
    });
  }

  private compareValues(value1: any, value2: any): number {
    // Case-insensitive karşılaştırma yapmak için her iki değeri de küçük harfe çeviriyoruz
    const str1 = String(value1).toLowerCase();
    const str2 = String(value2).toLowerCase();

    if (str1 < str2) return -1;
    if (str1 > str2) return 1;
    return 0;
  }
}
