import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookReviewComponent } from './book-review.component';
import { BookReviewService } from '../../../service/book-review.service';
import { BookService } from '../../../service/book.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
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
      'deleteReview',
    ]);
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getBookById',
      'updateBookRating',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BookReviewComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: BookReviewService, useValue: bookReviewServiceSpy },
        { provide: BookService, useValue: bookServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ bookId: 1 }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookReviewComponent);
    component = fixture.componentInstance;
    bookReviewService = TestBed.inject(BookReviewService) as jasmine.SpyObj<BookReviewService>;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load book details on initialization', () => {
    const book = {
      book_id: 1,
      title: 'Test Book',
      isbn: '12345',
      publication_year: 2023,
      genre: 'Fiction',
      summary: 'Test summary',
      PublisherName: 'Test Publisher',
      AuthorName: 'Test Author',
      language: 'English',
      file_path: '',
      AverageRating: 4.5,
      accessLevel: 'Public',
      PublisherId: 1
    };
    bookService.getBookById.and.returnValue(of(book));
    component.ngOnInit();
    expect(component.book).toEqual(book);
  });

  it('should load reviews for the selected book', () => {
    const reviews = [
      { review_id: 1, book_id: 1, user_id: 1, rating: 5, review_text: 'Great book!', review_date: new Date() },
    ];
    bookReviewService.getReviewsByBookId.and.returnValue(of(reviews));
    component.loadReviews();
    expect(component.reviews).toEqual(reviews);
  });

  it('should handle adding a review', () => {
    const newReview = {
      review_id: 2,
      book_id: 1,
      user_id: 2,
      rating: 4,
      review_text: 'Good book!',
      review_date: new Date(),
    };
    component.newReview = { rating: 4, review_text: 'Good book!' };
    component.selectedBookId = 1;
    bookReviewService.addReview.and.returnValue(of(newReview));

    component.submitReview();

    expect(bookReviewService.addReview).toHaveBeenCalled();
    expect(component.hasUserReviewed).toBeTrue();
    expect(component.successMessage).toContain('Đánh giá đã được thêm thành công!');
  });

  it('should load reviews for the selected book', () => {
    const reviews = [
      { review_id: 1, book_id: 1, user_id: 1, rating: 5, review_text: 'Great book!', review_date: new Date() },
    ];
    bookReviewService.getReviewsByBookId.and.returnValue(of(reviews));
    component.loadReviews();
    expect(component.reviews).toEqual(reviews);
  });
  
  it('should handle editing a review', () => {
    const review = {
      review_id: 1,
      book_id: 1,
      user_id: 1,
      rating: 5,
      review_text: 'Updated review!',
      review_date: new Date(),
      review_updated_at: new Date(),
    };
    component.editingReviewId = 1;
    component.editableReview = { ...review };
    bookReviewService.updateReview.and.returnValue(of(review));
  
    component.saveReview();
  
    expect(bookReviewService.updateReview).toHaveBeenCalledWith(component.editableReview);
    expect(component.successMessage).toContain('Cập nhật đánh giá thành công!');
  });  
  
  it('should handle deleting a review', () => {
    bookReviewService.deleteReview.and.returnValue(of(void 0));   
    component.deleteReview(1, 1);
  
    expect(bookReviewService.deleteReview).toHaveBeenCalledWith(1, 1);
    expect(component.successMessage).toContain('Đánh giá đã được xóa thành công!');
  });  

});