import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LinkLibraries } from '../model/link-library.model';

@Injectable({
  providedIn: 'root'
})
export class LinkLibraryService {
  private apiUrl = 'http://localhost:5283/api/LinkLibraries';
  constructor(private   http: HttpClient) { }
   // Phương thức để lấy danh sách các thư viện
  getLinkLibraries (): Observable<LinkLibraries []>{
    return this.http.get<LinkLibraries[]>(this.apiUrl);
  }

  // Phương thức để lấy thông tin chi tiết của một thư viện
  getLibraryById(id: number): Observable<LinkLibraries[]> {
    return this.http.get<LinkLibraries[]>(`${this.apiUrl}/${id}`);
  }
}



