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
  userRole: string = ''; // Vai trò của người dùng

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    // Lấy vai trò người dùng từ localStorage
    this.loadUserRole(); // Đọc vai trò người dùng khi component được khởi tạo
    // Lấy danh sách sách từ API
    this.loadBooks();
  }

  // Lấy vai trò người dùng từ localStorage
  loadUserRole(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole = user.role; // Lấy role của người dùng
    }
  }

  // Lấy danh sách sách từ API
  loadBooks(): void {
    this.bookService.getAllBooks().subscribe((data: Book[]) => {
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

  updateAccessLevel(bookId: number, event: Event): void {
    const target = event.target as HTMLSelectElement; // Ép kiểu đúng
    const newAccessLevel = target.value; // Lấy giá trị từ dropdown
    if (!newAccessLevel) {
      console.error('New access level is null or undefined.');
      return;
    }
    this.bookService.updateBookAccessLevel(bookId, newAccessLevel).subscribe(
      () => {
        console.log('Access level updated successfully.');
      },
      (error) => {
        console.error('Failed to update access level.', error);
        alert('Failed to update access level.');
      }
    );
  }
}

