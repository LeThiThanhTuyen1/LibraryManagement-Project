import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Book } from '../model/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:5283/api/Books';

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Có lỗi xảy ra, vui lòng thử lại sau.'));
  }

  getAllBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.apiUrl}/GetAllBooks`)
      .pipe(catchError(this.handleError));
  }

  getBookById(bookId: number): Observable<Book> {
    return this.http
      .get<Book>(`${this.apiUrl}/GetBookById/${bookId}`)
      .pipe(catchError(this.handleError));
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(catchError(this.handleError));
  }

  // Hàm cập nhật thông tin sách
  updateBook(id: number, bookData: any): Observable<any> {
    return this.http.put(`http://localhost:5283/api/Books/${id}`, bookData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json-patch+json')
    });
  }
  
 
  // Hàm xóa sách
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getGenres(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrl}/GetGenres`)
      .pipe(catchError(this.handleError));
  }

  getBookFile(bookId: number): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/GetBookFile/${bookId}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  updateBookAccessLevel(bookId: number, newAccessLevel: string): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/UpdateAccessLevel/${bookId}`, { accessLevel: newAccessLevel })
      .pipe(catchError(this.handleError));
  }

  updateBookRating(bookId: number, averageRating: number, reviewCount: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${bookId}/rating`, {
      averageRating,
      reviewCount,
    });
  }

  getBookById1(bookId: number): Observable<Book> {
    const url = `${this.apiUrl}/GetBookById/${bookId}`;
    return this.http.get<Book>(url);
  }

  viewDocument(bookId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/ViewDocument/${bookId}`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }
} 
