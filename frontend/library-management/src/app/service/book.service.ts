import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.book_id}`, book);
  }

  // Hàm xóa sách
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
