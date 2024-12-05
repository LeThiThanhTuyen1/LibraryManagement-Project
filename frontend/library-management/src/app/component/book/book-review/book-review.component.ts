import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookReviewService } from '../../../service/book-review.service';
import { BookReview } from '../../../model/book-review.model';
import { switchMap, of } from 'rxjs';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';

@Component({
  selector: 'app-book-review',
  templateUrl: './book-review.component.html',
  styleUrls: ['./book-review.component.css'],
})
export class BookReviewComponent implements OnInit {
  reviews: BookReview[] = [];
  selectedBookId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hasUserReviewed = false;
  userId = 1; // ID người dùng hiện tại
  stars: number[] = [1, 2, 3, 4, 5];
  hoveredRating: number | null = null;
  newReview: Partial<BookReview> = { rating: 0, review_text: '' };
  book!: Book;
  isLoading = true;

  // Biến cho chỉnh sửa
  editingReviewId: number | null = null;
  editableReview: Partial<BookReview> = {};

  constructor(
    private route: ActivatedRoute,
    private reviewService: BookReviewService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {

    
    this.route.params
      .pipe(
        switchMap((params) => {
          const bookId = +params['bookId'];
          if (!isNaN(bookId) && bookId > 0) {
            this.selectedBookId = bookId;
            return this.bookService.getBookById(bookId);
          } else {
            this.errorMessage = 'Invalid book ID.';
            return of(null);
          }
        }),
        switchMap((book) => {
          if (book) {
            this.book = book;
            return this.reviewService.checkUserReviewed(
              this.selectedBookId!,
              this.userId
            );
          } else {
            this.errorMessage = 'Book not found.';
            return of(null);
          }
        })
      )
      .subscribe({
        next: (userReview) => {
          this.hasUserReviewed = !!userReview;
          this.loadReviews(userReview); // Điều chỉnh để hỗ trợ null
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isLoading = false;
        },
      });
  }
  
  

  loadReviews(userReview?: BookReview | null): void {
    if (this.selectedBookId) {
      this.reviewService.getReviewsByBookId(this.selectedBookId).subscribe({
        next: (reviews) => {
          if (userReview) {
            reviews = reviews.filter(
              (review) => review.user_id !== this.userId
            );
            reviews.unshift(userReview);
          }
          this.reviews = reviews;
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
  }
  
  

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  setEditableRating(rating: number): void {
    this.editableReview.rating = rating;
  }

  hoverRating(rating: number): void {
    this.hoveredRating = rating;
  }

  resetHover(): void {
    this.hoveredRating = null;
  }

  submitReview(): void {
    if (!this.newReview.rating || !this.newReview.review_text) {
      this.errorMessage = 'Vui lòng hoàn thành thông tin đánh giá.';
      this.clearMessagesAfterDelay();
      return;
    }
  
    if (this.selectedBookId) {
      const review: BookReview = {
        book_id: this.selectedBookId,
        user_id: this.userId,
        rating: this.newReview.rating,
        review_text: this.newReview.review_text!,
        review_date: new Date(),
        review_id: 0,
      };
  
      this.reviewService.addReview(review).subscribe({
        next: (addedReview) => {
          this.newReview = { rating: 0, review_text: '' };
          this.hasUserReviewed = true;
          this.successMessage = 'Đánh giá đã được thêm thành công!';
          this.clearMessagesAfterDelay();
          this.loadReviews(addedReview); // Tải lại toàn bộ danh sách đánh giá
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
  }
  
  

  editReview(review: BookReview): void {
    this.editingReviewId = review.review_id!;
    this.editableReview = { ...review };
  }

  saveReview(): void {
    if (this.editingReviewId && this.editableReview.rating) {
      this.reviewService.updateReview(this.editableReview).subscribe({
        next: (updatedReview) => {
          const index = this.reviews.findIndex(
            (review) => review.review_id === this.editingReviewId
          );
          if (index > -1) this.reviews[index] = updatedReview;
          this.cancelEdit();
          this.successMessage = 'Review updated successfully!';
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
  }

  cancelEdit(): void {
    this.editingReviewId = null;
    this.editableReview = {};
  }

  // Hàm xóa đánh giá
  deleteReview(bookId: number, userId: number): void {
    this.reviewService.deleteReview(bookId, userId).subscribe({
      next: () => {
        // Xóa đánh giá khỏi danh sách
        this.reviews = this.reviews.filter(
          (review) => review.user_id !== userId
        );
        this.successMessage = 'Review deleted successfully!';
        this.clearMessagesAfterDelay();
        this.loadReviews(); // Tải lại danh sách đánh giá
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 3000);
  }
}
