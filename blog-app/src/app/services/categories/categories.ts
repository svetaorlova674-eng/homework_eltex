import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../articles/types/category';

const LS_KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    if (!environment.useApi) {
      const cats = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return of(cats);
    }
    return this.http.get<Category[]>('/api/categories');
  }

  createCategory(name: string): Observable<Category> {
    if (!environment.useApi) {
      const cats: Category[] = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      const newCat: Category = { id: String(Date.now()), name };
      cats.push(newCat);
      localStorage.setItem(LS_KEY, JSON.stringify(cats));
      return of(newCat);
    }
    return this.http.post<Category>('/api/categories', { name });
  }
}