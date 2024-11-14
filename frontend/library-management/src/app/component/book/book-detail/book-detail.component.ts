import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book!: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    const bookId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBookDetails(bookId);
  }

  loadBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((data: Book) => {
      this.book = data;
    });
  }
}
