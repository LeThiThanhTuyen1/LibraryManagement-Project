import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = []; // Mảng sách sử dụng model Book

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // Gọi service để lấy danh sách sách
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
  }
}
