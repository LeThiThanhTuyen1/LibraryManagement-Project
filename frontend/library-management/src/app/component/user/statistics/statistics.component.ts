import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  availableBooksCount: number = 0;
  booksByGenreCount: number = 0;
  mostPopularGenre: { Genre: string, Count: number } | null = null;
  booksByYearsCount: number = 0;
  libraryUsersCount: number = 0;

  genres: string[] = [];
  selectedGenre: string = '';
  startYear: number = 2000;
  endYear: number = 2025;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchAvailableBooksCount();
    this.fetchMostPopularGenre();
    this.fetchLibraryUsersCount();
    this.fetchGenres();
  }

  fetchAvailableBooksCount() {
    this.bookService.getAvailableBooksCount().subscribe(count => {
      this.availableBooksCount = count;
    });
  }

  fetchBooksByGenre() {
    if (this.selectedGenre) {
      this.bookService.getBooksCountByGenre(this.selectedGenre).subscribe(count => {
        this.booksByGenreCount = count;
      });
    }
  }

  fetchMostPopularGenre() {
    this.bookService.getMostPopularGenre().subscribe(data => {
      this.mostPopularGenre = data;
    }, error => {
      console.error('Lỗi khi tải thể loại phổ biến nhất:', error);
      this.mostPopularGenre = { Genre: 'Không xác định', Count: 0 };
    });
  }
  
  fetchBooksByYears() {
    this.bookService.getBooksCountByYears(this.startYear, this.endYear).subscribe(count => {
      this.booksByYearsCount = count;
    });
  }

  fetchLibraryUsersCount() {
    this.bookService.getLibraryUsersCount().subscribe(count => {
      this.libraryUsersCount = count;
    });
  }

  fetchGenres() {
    this.bookService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }
}
