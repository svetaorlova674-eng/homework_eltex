import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>('/api/categories', { name });
  }
}