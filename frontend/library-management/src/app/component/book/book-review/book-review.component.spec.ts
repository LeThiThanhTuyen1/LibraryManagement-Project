import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookReviewComponent } from './book-review.component';
import { BookReviewService } from '../../../service/book-review.service';
import { BookService } from '../../../service/book.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      'deleteReview',
    ]);
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getBookById', 'updateBookRating']);

    await TestBed.configureTestingModule({
      declarations: [BookReviewComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BookReviewService, useValue: bookReviewServiceSpy },
        { provide: BookService, useValue: bookServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ bookId: 1 }), // Mô phỏng URL parameter
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookReviewComponent);
    component = fixture.componentInstance;
    bookReviewService = TestBed.inject(BookReviewService) as jasmine.SpyObj<BookReviewService>;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;

    fixture.detectChanges();
  });

  it('should create the component successfully', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading).toBeTrue();
    expect(component.book).toBeUndefined();
  });

  it('should load book details and reviews on init', () => {
    const mockBook = { id: 1, title: 'Test Book', author: 'Author' };
    const mockReviews = [
      { user_id: 2, rating: 4, review_text: 'Great book!', book_id: 1 },
    ];
    const mockUserReview = {
      user_id: 1,
      rating: 5,
      review_text: 'My review!',
      book_id: 1,
    };

    bookService.getBookById.and.returnValue(of(mockBook));
    bookReviewService.getReviewsByBookId.and.returnValue(of(mockReviews));
    bookReviewService.checkUserReviewed.and.returnValue(of(mockUserReview));

    component.ngOnInit();
    fixture.detectChanges();

    expect(bookService.getBookById).toHaveBeenCalledWith(1);
    expect(bookReviewService.getReviewsByBookId).toHaveBeenCalledWith(1);
    expect(component.book).toEqual(mockBook);
    expect(component.reviews.length).toBe(2); // 1 user review + existing review
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when book is not found', () => {
    bookService.getBookById.and.returnValue(throwError(() => new Error('Book not found')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Book not found');
  });

  it('should add a review successfully and refresh the reviews', () => {
    const newReview = { rating: 5, review_text: 'Amazing book!' };
    const mockReview = { ...newReview, user_id: 1, book_id: 1, review_date: new Date() };
    const updatedReviews = [mockReview];

    bookReviewService.addReview.and.returnValue(of(mockReview));
    bookReviewService.getReviewsByBookId.and.returnValue(of(updatedReviews));

    component.newReview = newReview;
    component.submitReview();
    fixture.detectChanges();

    expect(bookReviewService.addReview).toHaveBeenCalledWith(newReview);
    expect(component.successMessage).toBe('Đánh giá đã được thêm thành công!');
    expect(component.reviews).toEqual(updatedReviews);
    expect(component.hasUserReviewed).toBeTrue();
  });

  it('should show error when adding a review fails', () => {
    bookReviewService.addReview.and.returnValue(throwError(() => new Error('Failed to add review')));

    component.newReview = { rating: 5, review_text: 'Amazing book!' };
    component.submitReview();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Failed to add review');
  });

  it('should delete a review successfully and refresh reviews', () => {
    const mockReviews = [
      { user_id: 1, rating: 4, review_text: 'Great book!', book_id: 1 },
    ];
    bookReviewService.deleteReview.and.returnValue(of());
    bookReviewService.getReviewsByBookId.and.returnValue(of(mockReviews));

    component.deleteReview(1, 1);
    fixture.detectChanges();

    expect(bookReviewService.deleteReview).toHaveBeenCalledWith(1, 1);
    expect(component.successMessage).toBe('Đánh giá đã được xóa thành công!');
    expect(component.reviews).toEqual(mockReviews);
  });

  it('should show error when deleting a review fails', () => {
    bookReviewService.deleteReview.and.returnValue(throwError(() => new Error('Failed to delete review')));

    component.deleteReview(1, 1);
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Xóa đánh giá thất bại. Vui lòng thử lại.');
  });
});