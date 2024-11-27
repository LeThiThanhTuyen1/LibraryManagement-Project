import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service'
import { Book } from '../../../model/book.model'; // Import model Book

@Component({
  selector: 'app-search-documents',
  templateUrl: './search-documents.component.html',
  styleUrls: ['./search-documents.component.css']
})
export class SearchDocumentsComponent implements OnInit {
  books: Book[] = []; // Danh sách sách từ API
  selectedBook: Book | null = null; // Sách được chọn để xem chi tiết
  searchCriteria: Partial<Book> = {}; // Tiêu chí tìm kiếm

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Lấy danh sách sách khi component được khởi tạo
    this.getAllBooks();
  }

  // Lấy tất cả sách từ API
  getAllBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        console.log('Danh sách sách:', this.books);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách sách:', err);
      }
    });
  }

  // Lấy chi tiết sách theo ID
  getBookById(bookId: number): void {
    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        this.selectedBook = book;
        console.log('Chi tiết sách:', this.selectedBook);
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết sách:', err);
      }
    });
  }

  // Lọc danh sách sách theo tiêu chí tìm kiếm
  // Lọc danh sách sách theo tiêu chí tìm kiếm
searchBooks(): void {
  const filteredBooks = this.books.filter(book => {
    return (
      (!this.searchCriteria.title || book.title.toLowerCase().includes(this.searchCriteria.title.toLowerCase())) &&
      (!this.searchCriteria.genre || book.genre.toLowerCase().includes(this.searchCriteria.genre.toLowerCase())) &&
      (!this.searchCriteria.AuthorName || book.AuthorName.toLowerCase().includes(this.searchCriteria.AuthorName.toLowerCase())) &&
      (!this.searchCriteria.language || book.language.toLowerCase().includes(this.searchCriteria.language.toLowerCase())) &&
      (!this.searchCriteria.publication_year || book.publication_year === this.searchCriteria.publication_year) &&
      (!this.searchCriteria.isbn || book.isbn.toLowerCase().includes(this.searchCriteria.isbn.toLowerCase()))
    );
  });

  console.log('Kết quả tìm kiếm:', filteredBooks);
  this.books = filteredBooks;
}

  
  // Reset tiêu chí tìm kiếm
  resetSearch(): void {
    this.searchCriteria = {};
    this.getAllBooks(); // Load lại toàn bộ danh sách
  }
}
