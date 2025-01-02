import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { BookReviewComponent } from './book-review.component';
import { BookService } from '../../../service/book.service';
import { BookReviewService } from '../../../service/book-review.service';
import { Book } from '../../../model/book.model';
import { BookReview } from '../../../model/book-review.model';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('Kiểm thử Component Đánh giá Sách', () => {
  let component: BookReviewComponent;
  let fixture: ComponentFixture<BookReviewComponent>;
  let mockBookService: jasmine.SpyObj<{
    getBookById: (id: number) => Observable<Book | null>;
    updateBookRating: (
      id: number,
      rating: number,
      count: number
    ) => Observable<void>;
  }>;
  let mockBookReviewService: jasmine.SpyObj<BookReviewService>;

  // Mock dữ liệu sách để test
  const mockSach: Book = {
    book_id: 1,
    title: 'Sách Test',
    AuthorName: 'Tác giả Test',
    publication_year: 2023,
    isbn: '123456789',
    genre: 'Thể loại Test',
    language: 'Tiếng Việt',
    summary: 'Tóm tắt Test',
    PublisherName: 'NXB Test',
    PublisherId: 1,
    file_path: 'test/path',
    AverageRating: 4,
    accessLevel: 'public',
  };

  // Mock dữ liệu đánh giá để test
  const mockDanhGia: BookReview[] = [
    {
      review_id: 1,
      book_id: 1,
      user_id: 1,
      rating: 4,
      review_text: 'Sách rất hay!',
      review_date: new Date(),
      username: 'nguoidung1',
      review_updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    mockBookService = jasmine.createSpyObj<{
      getBookById: (id: number) => Observable<Book | null>;
      updateBookRating: (
        id: number,
        rating: number,
        count: number
      ) => Observable<void>;
    }>('BookService', ['getBookById', 'updateBookRating']);
    mockBookService.getBookById.and.returnValue(of(mockSach));
    mockBookService.updateBookRating.and.returnValue(of(void 0));
    mockBookReviewService = jasmine.createSpyObj('BookReviewService', [
      'getReviewsByBookId',
      'addReview',
      'checkUserReviewed',
      'updateReview',
      'deleteReview',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BookReviewComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: BookService, useValue: mockBookService },
        { provide: BookReviewService, useValue: mockBookReviewService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ bookId: '1' }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReviewComponent);
    component = fixture.componentInstance;

    // Mock localStorage
    const mockNguoiDung = {
      user_id: 1,
      username: 'nguoidung1',
      first_name: 'Nguoi',
      last_name: 'Dung',
    };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(mockNguoiDung)
    );

    // Setup mock returns
    mockBookService.getBookById.and.returnValue(of(mockSach));
    mockBookReviewService.getReviewsByBookId.and.returnValue(of(mockDanhGia));
    mockBookReviewService.checkUserReviewed.and.returnValue(of(null));

    // Thêm dòng này để set selectedBookId
    component.selectedBookId = 1;

    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('Khởi tạo Component', () => {
    // Test 1: Kiểm tra khởi tạo component
    it('Khởi tạo component thành công', () => {
      expect(component).toBeTruthy();
    });

    // Test 2: Sửa test load dữ liệu ban đầu
    it('Tải thông tin sách và đánh giá khi khởi tạo', fakeAsync(() => {
      // Setup mocks
      mockBookService.getBookById.and.returnValue(of(mockSach));
      mockBookReviewService.getReviewsByBookId.and.returnValue(of(mockDanhGia));

      // Set selectedBookId
      component.selectedBookId = 1;

      // Call ngOnInit
      component.ngOnInit();

      // First tick for getBookById
      tick();

      // Second tick for getReviewsByBookId
      tick();

      // Verify results
      expect(component.book).toEqual(mockSach);
      expect(component.reviews).toEqual(mockDanhGia);
      expect(component.isLoading).toBeFalse();

      // Verify service calls
      expect(mockBookService.getBookById).toHaveBeenCalledWith(1);
      expect(mockBookReviewService.getReviewsByBookId).toHaveBeenCalledWith(1);
    }));

    // Test 3: Sửa test xử lý khi không tìm thấy sách
    it('Hiển thị lỗi khi không tìm thấy sách', fakeAsync(() => {
      // Reset các mock
      mockBookService.getBookById.calls.reset();
      mockBookReviewService.getReviewsByBookId.calls.reset();

      // Setup mock trả về null cho sách không tìm thấy
      mockBookService.getBookById.and.returnValue(of(null));
      component.selectedBookId = 1;

      // Gọi ngOnInit
      component.ngOnInit();

      // Đợi cho getBookById hoàn thành
      tick();

      // Kiểm tra kết quả
      expect(component.errorMessage).toBe('Không tìm thấy sách.');
      expect(component.isLoading).toBeFalse();
      expect(mockBookService.getBookById).toHaveBeenCalledWith(1);
      expect(mockBookReviewService.getReviewsByBookId).not.toHaveBeenCalled();
    }));
  });

  describe('Gửi đánh giá', () => {
    beforeEach(() => {
      component.selectedBookId = 1;
      component.newReview = {
        book_id: 1,
        user_id: 1,
        rating: 4,
        review_text: 'Bài đánh giá test',
      };
      mockBookReviewService.getReviewsByBookId.and.returnValue(of(mockDanhGia));
    });

    // Test 4: Sửa test gửi đánh giá thành công
    it('Gửi đánh giá thành công', fakeAsync(() => {
      const review = {
        book_id: 1,
        user_id: 1,
        username: 'nguoidung1',
        rating: 4,
        review_text: 'Bài đánh giá test',
        review_date: jasmine.any(Date),
        review_id: 0,
      };

      mockBookReviewService.addReview.and.returnValue(of(mockDanhGia[0]));
      mockBookReviewService.getReviewsByBookId.and.returnValue(of(mockDanhGia));

      component.submitReview();
      tick();

      expect(mockBookReviewService.addReview).toHaveBeenCalledWith(
        jasmine.objectContaining(review)
      );
      expect(component.successMessage).toBe(
        'Đánh giá đã được thêm thành công!'
      );
      tick(3000);
    }));

    // Test 5: Sửa test validation form đánh giá
    it('Kiểm tra thông tin đánh giá trước khi gửi', fakeAsync(() => {
      component.newReview.rating = 0;
      component.submitReview();
      tick();
      expect(component.errorMessage).toBe(
        'Vui lòng nhập đầy đủ đánh giá và nội dung bình luận'
      );
      tick(3000);
    }));
  });

  describe('Chỉnh sửa đánh giá', () => {
    // Test 6: Kiểm tra bật chế độ chỉnh sửa
    it('Bật chế độ chỉnh sửa', () => {
      component.editReview(mockDanhGia[0]);
      expect(component.editingReviewId).toBe(mockDanhGia[0].review_id || null);
      expect(component.editableReview).toEqual(mockDanhGia[0]);
    });

    // Test 7: Kiểm tra lưu đánh giá sau khi chỉnh sửa
    it('Lưu đánh giá đã chỉnh sửa thành công', fakeAsync(() => {
      const danhGiaDaCapNhat = {
        ...mockDanhGia[0],
        review_text: 'Đánh giá đã cập nhật',
      };
      mockBookReviewService.updateReview.and.returnValue(of(danhGiaDaCapNhat));
      mockBookReviewService.getReviewsByBookId.and.returnValue(
        of([danhGiaDaCapNhat])
      );

      component.editingReviewId = 1;
      component.editableReview = danhGiaDaCapNhat;
      component.saveReview();
      tick();

      expect(component.successMessage).toBe('Cập nhật đánh giá thành công!');
      tick(3000);
    }));

    // Test 8: Kiểm tra hủy chỉnh sửa
    it('Hủy chế độ chỉnh sửa', () => {
      component.editingReviewId = 1;
      component.cancelEdit();
      expect(component.editingReviewId).toBeNull();
      expect(component.editableReview).toEqual({});
    });
  });

  describe('Xóa đánh giá', () => {
    // Test 9: Kiểm tra xóa đánh giá thành công
    it('Xóa đánh giá thành công', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockBookReviewService.deleteReview.and.returnValue(of(void 0));
      component.deleteReview(1, 1);
      tick();
      expect(component.successMessage).toBe('Đánh giá đã được xóa thành công!');
      tick(3000);
    }));

    // Test 10: Kiểm tra hủy xóa đánh giá
    it('Không xóa khi người dùng hủy', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.deleteReview(1, 1);
      tick();
      expect(mockBookReviewService.deleteReview).not.toHaveBeenCalled();
    }));
  });

  describe('Giao diện người dùng', () => {
    beforeEach(() => {
      component.book = mockSach;
      component.reviews = mockDanhGia;
      fixture.detectChanges();
    });

    // Test 11: Kiểm tra hiển thị form đánh giá
    it('Hiển thị form đánh giá khi chưa đánh giá', () => {
      component.hasUserReviewed = false;
      fixture.detectChanges();
      const reviewForm = fixture.debugElement.query(By.css('textarea'));
      expect(reviewForm).toBeTruthy();
    });

    // Test 12: Sửa test hiển thị danh sách đánh giá
    it('Hiển thị danh sách đánh giá', () => {
      component.reviews = mockDanhGia;
      fixture.detectChanges();
      const reviewElements = fixture.debugElement.queryAll(
        By.css('.review-item')
      );
      expect(reviewElements.length).toBe(mockDanhGia.length);
    });

    // Test 13: Kiểm tra hiển thị thông báo lỗi
    it('Hiển thị thông báo lỗi', () => {
      component.errorMessage = 'Lỗi test';
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement.nativeElement.textContent).toContain('Lỗi test');
    });
  });
});
