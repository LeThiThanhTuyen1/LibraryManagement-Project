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
  bookId!: number;
  isLoading = true;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookId = params['id'];
      this.loadBookDetails(this.bookId);
    });
  }

  loadBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((data: Book) => {
      this.book = data;
      console.log('Chi tiết sách:', this.book); // Debug kiểm tra
      this.isLoading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }
}
