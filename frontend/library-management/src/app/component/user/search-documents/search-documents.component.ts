import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model'; // Import model Book

@Component({
  selector: 'app-search-documents',
  templateUrl: './search-documents.component.html',
  styleUrls: ['./search-documents.component.css'],
})
export class SearchDocumentsComponent implements OnInit {
  books: Book[] = []; // Danh sách sách từ API
  selectedBook: Book | null = null; // Sách được chọn để xem chi tiết
  searchCriteria: Partial<Book> = {}; // Tiêu chí tìm kiếm
  genres: string[] = [];
  noBooksFound: boolean = false; // Cờ hiển thị thông báo không tìm thấy sách
  allBooks: Book[] = []; // Danh sách sách gốc
  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Lấy danh sách sách khi component được khởi tạo
    this.getAllBooks();
    this.loadGenres();
  }

  // Lấy tất cả sách từ API
  getAllBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.allBooks = data; // Lưu bản gốc
        console.log('Danh sách sách:', this.books);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách sách:', err);
      },
    });
  }

  loadGenres(): void {
    this.bookService.getGenres().subscribe({
      next: (data) => {
        this.genres = data;
        console.log('Danh sách thể loại:', this.genres);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách thể loại:', err);
      },
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
      },
    });
  }

  // Lọc danh sách sách theo tiêu chí tìm kiếm
  searchBooks(): void {
    const filteredBooks = this.allBooks.filter((book) => {
      return (
        (!this.searchCriteria.title ||
          book.title
            .toLowerCase()
            .includes(this.searchCriteria.title.toLowerCase())) &&
        (!this.searchCriteria.genre ||
          book.genre
            .toLowerCase()
            .includes(this.searchCriteria.genre.toLowerCase())) &&
        (!this.searchCriteria.AuthorName ||
          book.AuthorName.toLowerCase().includes(
            this.searchCriteria.AuthorName.toLowerCase()
          )) &&
        (!this.searchCriteria.language ||
          book.language
            .toLowerCase()
            .includes(this.searchCriteria.language.toLowerCase())) &&
        (!this.searchCriteria.publication_year ||
          book.publication_year === this.searchCriteria.publication_year) &&
        (!this.searchCriteria.isbn ||
          book.isbn
            .toLowerCase()
            .includes(this.searchCriteria.isbn.toLowerCase()))
      );
    });

    this.books = filteredBooks;
    this.noBooksFound = filteredBooks.length === 0; // Kiểm tra nếu không tìm thấy sách nào
    console.log('Kết quả tìm kiếm:', filteredBooks);
  }

  // Reset tiêu chí tìm kiếm
  resetSearch(): void {
    this.searchCriteria = {};
    this.books = [...this.allBooks]; // Khôi phục lại danh sách ban đầu
    this.noBooksFound = false; // Ẩn thông báo
  }
}
