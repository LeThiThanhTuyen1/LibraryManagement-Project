import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:5283/api/Documents';

  constructor(private http: HttpClient) {}

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, {
      observe: 'response'  // Đảm bảo nhận toàn bộ phản hồi, bao gồm cả body và status
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Lỗi khi chia sẻ tài liệu: ' + error.message));
      })
    );
  }
}
