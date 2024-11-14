import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = []; // Mảng sách

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  // Lấy danh sách sách từ API
  loadBooks(): void {
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
  }

  // Xem chi tiết sách khi click vào
  viewBook(id: number): void {
    this.router.navigate([`/book-detail/${id}`]); // Điều hướng đến trang chi tiết
  }

  // Thêm sách
  addBook(newBook: Book): void {
    this.bookService.addBook(newBook).subscribe(book => {
      this.books.push(book); // Thêm sách vào danh sách sau khi thêm thành công
    });
  }

  // Xóa sách
  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.books = this.books.filter(book => book.book_id !== bookId); // Xóa sách khỏi danh sách
    });
  }
}
