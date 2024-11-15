import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { Publisher } from '../../../model/publisher.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const bookId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBookDetails(bookId);
  }

  loadBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((data: Book) => {
      this.book = data;
      if (this.book.publisher && this.book.publisher.publisher_id) {
        this.loadPublisherDetails(this.book.publisher.publisher_id);
      }
      this.isLoading = false;
    });
  }
  loadPublisherDetails(publisherId: number): void {
    this.bookService.getPublisherById(publisherId).subscribe((publisher: Publisher) => {
      this.book.publisher = publisher;
    });
  }
  goBack(): void {
    this.location.back();
  }
}
