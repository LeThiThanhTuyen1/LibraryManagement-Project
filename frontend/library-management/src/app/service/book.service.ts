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

  updateBook(book: Book): Observable<Book> {
    return this.http
      .put<Book>(`${this.apiUrl}/${book.book_id}`, book)
      .pipe(catchError(this.handleError));
  }
  deleteBook(bookId: number): Observable<Book> {
    return this.http
      .delete<Book>(`${this.apiUrl}/DeleteBook/${bookId}`)
      .pipe(catchError(this.handleError));
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


}
