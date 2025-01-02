import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookReviewService } from '../../../service/book-review.service';
import { BookReview } from '../../../model/book-review.model';
import { switchMap, of, timer } from 'rxjs';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-book-review',
  templateUrl: './book-review.component.html',
  styleUrls: ['./book-review.component.css'],
})
export class BookReviewComponent implements OnInit {
  @Input() selectedBookId!: number;
  @Input() hideReviewButton: boolean = false;
  addReview(newReview: BookReview) {
    throw new Error('Method not implemented.');
  }
  reviews: BookReview[] = [];
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

  // Thêm biến firstName
  firstName!: string;

  constructor(
    private route: ActivatedRoute,
    private reviewService: BookReviewService,
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.selectedBookId) {
      this.route.params.subscribe((params) => {
        this.selectedBookId = +params['id'];
        if (this.selectedBookId) {
          this.loadBookAndReviews();
        }
      });
    } else {
      this.loadBookAndReviews();
    }
  }

  private loadBookAndReviews(): void {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('user');
    console.log('Raw stored user:', storedUser);

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Parsed user data:', user);
        this.userId = user.user_id;
        this.firstName = user.first_name;

        console.log('Extracted user info:', {
          userId: this.userId,
          firstName: this.firstName,
        });

        // Load book info
        this.bookService.getBookById(this.selectedBookId).subscribe({
          next: (book) => {
            if (!book) {
              this.errorMessage = 'Không tìm thấy sách.';
              this.isLoading = false;
              return;
            }
            
            this.book = book;
            
            // Chỉ load reviews khi có sách
            this.reviewService.getReviewsByBookId(this.selectedBookId).subscribe({
              next: (reviews) => {
                this.reviews = reviews;
                this.isLoading = false;
                
                // Check if user has already reviewed
                if (reviews.some(review => review.user_id === this.userId)) {
                  this.hasUserReviewed = true;
                }
              },
              error: (error) => {
                console.error('Error loading reviews:', error);
                this.errorMessage = 'Không thể tải đánh giá. Vui lòng thử lại sau.';
                this.isLoading = false;
              }
            });
          },
          error: (error) => {
            console.error('Error loading book:', error);
            this.errorMessage = 'Không thể tải thông tin sách. Vui lòng thử lại sau.';
            this.isLoading = false;
          }
        });

      } catch (error) {
        console.error('Error parsing user data:', error);
        this.errorMessage = 'Dữ liệu người dùng không hợp lệ.';
        this.isLoading = false;
      }
    }
  }

  loadReviews(userReview?: BookReview | null): void {
    if (this.selectedBookId) {
      const storedUser = localStorage.getItem('user');
      console.log('Stored user:', storedUser);

      this.reviewService.getReviewsByBookId(this.selectedBookId).subscribe({
        next: (reviews) => {
          console.log('Original reviews:', reviews);

          // Thêm kiểm tra Array
          if (Array.isArray(reviews)) {
            this.hasUserReviewed = reviews.some(
              (review) => review.user_id === this.userId
            );

            const reviewPromises = reviews.map((review) =>
              this.authService
                .getUserById(review.user_id)
                .toPromise()
                .then((user) => ({
                  ...review,
                  username: user
                    ? `${user.first_name} ${user.last_name}`
                    : 'Người dùng khác',
                }))
                .catch(() => ({
                  ...review,
                  username: 'Người dùng khác',
                }))
            );

            Promise.all(reviewPromises).then((updatedReviews) => {
              if (userReview) {
                updatedReviews = updatedReviews.filter(
                  (review) => review.user_id !== this.userId
                );
                const user = JSON.parse(storedUser || '{}');
                updatedReviews.unshift({
                  ...userReview,
                  username: `${user.first_name} ${user.last_name}`,
                });
              }

              // Sắp xếp đánh giá theo thời gian mới nhất
              this.reviews = updatedReviews.sort((a, b) => {
                const dateA = a.review_updated_at
                  ? new Date(a.review_updated_at)
                  : new Date(a.review_date);
                const dateB = b.review_updated_at
                  ? new Date(b.review_updated_at)
                  : new Date(b.review_date);
                return dateB.getTime() - dateA.getTime();
              });

              console.log('Final reviews with usernames:', this.reviews);
            });
          } else {
            this.errorMessage = 'Không thể tải đánh giá';
          }
        },
        error: (err) => {
          console.error('Error loading reviews:', err);
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

  reloadReviewsWithDelay(): void {
    // Delay 1 giây trước khi load lại
    timer(1000).subscribe(() => {
      this.loadReviews();
    });
  }

  submitReview(): void {
    if (!this.newReview.rating || !this.newReview.review_text) {
      this.errorMessage = 'Vui lòng nhập đầy đủ đánh giá và nội dung bình luận';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.errorMessage = 'Không tìm thấy thông tin người dùng';
      return;
    }

    const user = JSON.parse(storedUser);

    if (this.selectedBookId) {
      const review: BookReview = {
        book_id: this.selectedBookId,
        user_id: user.user_id,
        username: user.username,
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
          setTimeout(() => this.successMessage = '', 3000);
          // Load chậm
          this.reloadReviewsWithDelay();
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
    if (
      !this.editingReviewId ||
      !this.editableReview.rating ||
      !this.editableReview.review_text
    ) {
      this.errorMessage = 'Vui lòng hoàn thành thông tin chỉnh sửa.';
      this.clearMessagesAfterDelay();
      return;
    }

    this.editableReview.review_updated_at = new Date();

    this.reviewService.updateReview(this.editableReview).subscribe({
      next: () => {
        this.cancelEdit();
        this.successMessage = 'Cập nhật đánh giá thành công!';
        this.clearMessagesAfterDelay();
        // Load chậm
        this.reloadReviewsWithDelay();
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
        // Reset trạng thái đánh giá
        this.hasUserReviewed = false;
        // Reset form đánh giá mới
        this.newReview = { rating: 0, review_text: '' };
        // Load chậm
        this.reloadReviewsWithDelay();
      },
      error: (err) => {
        this.errorMessage = 'Xóa đánh giá thất bại. Vui lòng thử lại.';
        console.error(err);
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
