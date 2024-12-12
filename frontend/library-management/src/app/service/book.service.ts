import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../model/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5283/api/Books';

  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    const url = `${this.apiUrl}/GetAllBooks`;
    return this.http.get<Book[]>(url);
  }
  
  getBookById(bookId: number): Observable<Book> {
    const url = `${this.apiUrl}/GetBookById/${bookId}`;
    return this.http.get<Book>(url);
  }
  // Hàm thêm sách mới
  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
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
    const url = `${this.apiUrl}/GetGenres`;
    return this.http.get<string[]>(url);
  }

  getBookFile(bookId: number): Observable<Blob> {
    const url = `${this.apiUrl}/GetBookFile/${bookId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  updateBookAccessLevel(bookId: number, newAccessLevel: string): Observable<any> {
    const url = `${this.apiUrl}/UpdateAccessLevel/${bookId}`;
    return this.http.put(url, { accessLevel: newAccessLevel });
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
} 