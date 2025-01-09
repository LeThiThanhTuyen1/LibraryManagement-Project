import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Document } from '../model/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:5283/api/Documents';

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl, {
      observe: 'response',  // Nhận toàn bộ phản hồi
      responseType: 'json'  // Đảm bảo rằng phản hồi được nhận dưới dạng JSON
    }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('Phản hồi không thành công: ' + response.status);
        }
        return response.body as Document[];  // Trả về nội dung body
      }),
      catchError(error => {
        // Xử lý lỗi và trả về thông báo chi tiết hơn
        return throwError(() => new Error('Lỗi khi tải danh sách tài liệu: ' + (error.error || error.message)));
      })
    );
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      observe: 'response',  // Nhận toàn bộ phản hồi, bao gồm status và headers
      responseType: 'text'  // Đảm bảo rằng phản hồi được nhận dưới dạng văn bản thay vì JSON
    }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('Phản hồi không thành công: ' + response.status);
        }
        return response.body;  // Trả về nội dung body (văn bản)
      }),
      catchError(error => {
        // Xử lý lỗi và trả về thông báo chi tiết hơn
        return throwError(() => new Error('Lỗi khi chia sẻ tài liệu: ' + (error.error || error.message)));
      })
    );
  }

  approveDocument(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {}, {
      observe: 'response',  // Nhận toàn bộ phản hồi
      responseType: 'text'  // Đảm bảo rằng phản hồi được nhận dưới dạng văn bản
    }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('Phản hồi không thành công: ' + response.status);
        }
        return response.body;  // Trả về nội dung body
      }),
      catchError(error => {
        // Xử lý lỗi và trả về thông báo chi tiết hơn
        return throwError(() => new Error('Lỗi khi duyệt tài liệu: ' + (error.error || error.message)));
      })
    );
  }

  rejectDocument(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, {}, {
      observe: 'response',  // Nhận toàn bộ phản hồi
      responseType: 'text'  // Đảm bảo rằng phản hồi được nhận dưới dạng văn bản
    }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('Phản hồi không thành công: ' + response.status);
        }
        return response.body;  // Trả về nội dung body
      }),
      catchError(error => {
        // Xử lý lỗi và trả về thông báo chi tiết hơn
        return throwError(() => new Error('Lỗi khi từ chối tài liệu: ' + (error.error || error.message)));
      })
    );
  }

  viewDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/ViewDocument/${id}`, { responseType: 'blob' });
  }
  
}
