import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '../models/title';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private http = inject(HttpClient);
  private API_TITLES = 'http://localhost:3000/titles';

  getTitles(): Observable<Title[]> {
    return this.http.get<Title[]>(this.API_TITLES);
  }

  getTitle(id: number): Observable<Title> {
    return this.http.get<Title>(`${this.API_TITLES}/${id}`);
  }

  postTitle(title: Title): Observable<Title> {
    return this.http.post<Title>(this.API_TITLES, title);
  }

  putTitle(id: number, title: Title): Observable<Title> {
    return this.http.put<Title>(`${this.API_TITLES}/${id}`, title);
  }

  deleteTitle(id: number): Observable<unknown> {
    return this.http.delete(`${this.API_TITLES}/${id}`);
  }
}
