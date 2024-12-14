import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookReviewComponent } from './book-review.component';
import { BookReviewService } from '../../../service/book-review.service';
import { BookService } from '../../../service/book.service';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('BookReviewComponent', () => {
  let component: BookReviewComponent;
  let fixture: ComponentFixture<BookReviewComponent>;
  let bookReviewService: jasmine.SpyObj<BookReviewService>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    const bookReviewServiceSpy = jasmine.createSpyObj('BookReviewService', [
      'getReviewsByBookId',
      'checkUserReviewed',
      'addReview',
      'updateReview',
      'deleteReview'
    ]);
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getBookById',
      'updateBookRating'
    ]);

    // Setup default spy responses
    bookReviewServiceSpy.getReviewsByBookId.and.returnValue(of([]));
    bookReviewServiceSpy.checkUserReviewed.and.returnValue(of(false));
    bookServiceSpy.getBookById.and.returnValue(of({}));
    bookServiceSpy.updateBookRating.and.returnValue(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [BookReviewComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: BookReviewService, useValue: bookReviewServiceSpy },
        { provide: BookService, useValue: bookServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ bookId: 1 }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookReviewComponent);
    component = fixture.componentInstance;
    bookReviewService = TestBed.inject(BookReviewService) as jasmine.SpyObj<BookReviewService>;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reviews on init', () => {
    const mockReviews = [
      {
        review_id: 1,
        book_id: 1,
        user_id: 1,
        rating: 5,
        review_text: 'Great book!',
        review_date: new Date(),
        review_updated_at: new Date()
      }
    ];
    bookReviewService.getReviewsByBookId.and.returnValue(of(mockReviews));
    component.ngOnInit();
    expect(bookReviewService.getReviewsByBookId).toHaveBeenCalled();
  });

  it('should handle submitting a review', () => {
    const mockReview = {
      review_id: 1,
      book_id: 1,
      user_id: 1,
      rating: 5,
      review_text: 'Great book!',
      review_date: new Date(),
      review_updated_at: new Date()
    };

    bookReviewService.addReview.and.returnValue(of(mockReview));
    bookReviewService.getReviewsByBookId.and.returnValue(of([mockReview]));
    bookService.updateBookRating.and.returnValue(EMPTY);

    component.selectedBookId = 1;
    component.newReview = {
      rating: 5,
      review_text: 'Great book!'
    };

    component.submitReview();

    expect(bookReviewService.addReview).toHaveBeenCalled();
    expect(component.successMessage).toContain('Đánh giá đã được thêm thành công!');
  });

  it('should handle editing a review', () => {
    const mockReview = {
      review_id: 1,
      book_id: 1,
      user_id: 1,
      rating: 5,
      review_text: 'Updated review!',
      review_date: new Date(),
      review_updated_at: new Date()
    };

    bookReviewService.updateReview.and.returnValue(of(mockReview));
    bookReviewService.getReviewsByBookId.and.returnValue(of([mockReview]));
    bookService.updateBookRating.and.returnValue(EMPTY);

    component.editingReviewId = 1;
    component.editableReview = { ...mockReview };
    component.selectedBookId = 1;

    component.saveReview();

    expect(bookReviewService.updateReview).toHaveBeenCalledWith(mockReview);
    expect(component.successMessage).toContain('Cập nhật đánh giá thành công!');
  });

  it('should handle deleting a review', () => {
    bookReviewService.deleteReview.and.returnValue(of(void 0));
    bookReviewService.getReviewsByBookId.and.returnValue(of([]));
    bookService.updateBookRating.and.returnValue(EMPTY);

    component.selectedBookId = 1;
    component.deleteReview(1, 1);

    expect(bookReviewService.deleteReview).toHaveBeenCalledWith(1, 1);
    expect(component.successMessage).toContain('Đánh giá đã được xóa thành công!');
  });
});
