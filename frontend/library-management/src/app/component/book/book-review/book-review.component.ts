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
  selectedBookId: number = 0;;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hasUserReviewed = false;
  userId!: number; // ID người dùng hiện tại sẽ lấy từ localStorage
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
    // Lấy userId từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = user.user_id; // Lấy user_id từ object
      } catch (error) {
        this.errorMessage = 'Dữ liệu người dùng không hợp lệ.';
        this.isLoading = false;
        return;
      }
    } else {
      this.errorMessage = 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.';
      this.isLoading = false;
      return;
    }

    this.route.params
      .pipe(
        switchMap((params) => {
          const bookId = +params['bookId'];
          if (!isNaN(bookId) && bookId > 0) {
            this.selectedBookId = bookId;
            return this.bookService.getBookById(bookId);
          } else {
            this.errorMessage = 'ID sách không hợp lệ.';
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
            this.errorMessage = 'Không tìm thấy sách.';
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
    if (!this.editingReviewId || !this.editableReview.rating || !this.editableReview.review_text) {
      this.errorMessage = 'Vui lòng hoàn thành thông tin chỉnh sửa.';
      this.clearMessagesAfterDelay();
      return;
    }
  
    this.editableReview.review_updated_at = new Date();
  
    this.reviewService.updateReview(this.editableReview).subscribe({
      next: () => {
        const index = this.reviews.findIndex((r) => r.review_id === this.editingReviewId);
        if (index > -1) this.reviews[index] = { ...this.editableReview } as BookReview;
  
        this.cancelEdit();
        this.successMessage = 'Cập nhật đánh giá thành công!';
        this.clearMessagesAfterDelay();
        
        this.loadReviews(); // Tải lại danh sách đánh giá
        this.updateBookRating(); // Cập nhật điểm trung bình
      },
      error: (err) => {
        this.errorMessage = 'Chỉnh sửa đánh giá thất bại. Vui lòng thử lại.';
        this.clearMessagesAfterDelay();
        console.error(err);
      },
    });
  }

  cancelEdit(): void {
    this.editingReviewId = null;
    this.editableReview = {};
  }

  deleteReview(bookId: number, userId: number): void {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa đánh giá này?');
    if (!confirmation) return;
  
    this.reviewService.deleteReview(bookId, userId).subscribe({
      next: () => {
        this.successMessage = 'Đánh giá đã được xóa thành công!';
        this.clearMessagesAfterDelay();
        this.loadReviews(); // Tải lại danh sách đánh giá
        this.updateBookRating(); // Cập nhật điểm trung bình
      },
      error: (err) => {
        this.errorMessage = 'Xóa đánh giá thất bại. Vui lòng thử lại.';
        console.error(err);
      },
    });
  }
  
  updateBookRating(): void {
    if (this.selectedBookId !== null) {
      this.reviewService.getReviewsByBookId(this.selectedBookId).subscribe({
        next: (reviews) => {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = reviews.length ? totalRating / reviews.length : 0;
          this.bookService.updateBookRating(this.selectedBookId, averageRating, reviews.length).subscribe({
            next: () => console.log('Cập nhật điểm trung bình thành công.'),
            error: (err) => console.error('Cập nhật điểm trung bình thất bại:', err),
          });
        },
        error: (err) => console.error('Lấy danh sách đánh giá thất bại:', err),
      });
    } else {
      console.error('selectedBookId không hợp lệ.');
    }
  }
  
  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 3000);
  }
}
