import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  userRole: string = '';
  showDialog: boolean = false;
  dialogMessage: string = '';
  dialogType: 'confirm' | 'message' = 'message';
  pendingDeleteId: number | null = null;

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.loadUserRole();
    this.loadBooks();
  }

  loadUserRole(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userRole = user.role;
      } catch (error) {
        console.error('Error parsing user role:', error);
      }
    }
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        alert('Không thể tải danh sách sách.');
      },
    });
  }

  viewBook(id: number): void {
    this.router.navigate([`/book-detail/${id}`]); // Điều hướng đến trang chi tiết
  }

  editBook(bookId: number): void {
    // Điều hướng đến trang chỉnh sửa với ID sách
    this.router.navigate([`/book-edit/${bookId}`]);
  }

  // Thêm sách
  addBook(newBook: Book): void {
    this.bookService.addBook(newBook).subscribe(book => {
      this.books.push(book); // Thêm sách vào danh sách sau khi thêm thành công
    });
  }

  deleteBook(bookId: number): void {
    this.pendingDeleteId = bookId;
    this.dialogType = 'confirm';
    this.showDialog = true;
    this.dialogMessage = 'Bạn có chắc chắn muốn xóa tài liệu này?';
  }

  confirmDelete(): void {
    if (this.pendingDeleteId) {
      this.bookService.deleteBook(this.pendingDeleteId).subscribe({
        next: () => {
          this.books = this.books.filter((book) => book.book_id !== this.pendingDeleteId);
          this.dialogType = 'message';
          this.dialogMessage = 'Xóa tài liệu thành công!';
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          this.dialogType = 'message';
          this.dialogMessage = 'Xóa tài liệu thất bại!';
        },
      });
    }
  }

  closeDialog(confirmed: boolean = false): void {
    if (this.dialogType === 'confirm' && confirmed) {
      this.confirmDelete();
    } else {
      this.showDialog = false;
      this.dialogMessage = '';
      this.pendingDeleteId = null;
    }
  }

  updateAccessLevel(bookId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newAccessLevel = target.value;

    this.bookService.updateBookAccessLevel(bookId, newAccessLevel).subscribe({
      next: () => {
        console.log('Access level updated successfully.');
      },
      error: (error) => {
        console.error('Error updating access level:', error);
        alert('Cập nhật cấp truy cập thất bại!');
      },
    });
  }
}
