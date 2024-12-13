import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookAdminService {
  private apiBaseUrl = 'http://localhost:5283/api';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiBaseUrl}/upload`, formData);
  }

  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/BookAdmin/add`, book);
  }
}
