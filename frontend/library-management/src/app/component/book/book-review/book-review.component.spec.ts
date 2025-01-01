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
    const mockNguoiDung = { user_id: 1, username: 'nguoidung1' };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(mockNguoiDung)
    );

    // Setup mock returns
    mockBookService.getBookById.and.returnValue(of(mockSach));
    mockBookReviewService.getReviewsByBookId.and.returnValue(of(mockDanhGia));
    mockBookReviewService.checkUserReviewed.and.returnValue(of(null));

    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('Khởi tạo Component', () => {
    // Test 1: Kiểm tra khởi tạo component
    it('Khởi tạo component thành công', () => {
      expect(component).toBeTruthy();
    });

    // Test 2: Kiểm tra load dữ liệu ban đầu
    it('Tải thông tin sách và đánh giá khi khởi tạo', fakeAsync(() => {
      tick();
      expect(component.book).toEqual(mockSach);
      expect(component.reviews).toEqual(mockDanhGia);
      expect(component.isLoading).toBeFalse();
    }));

    // Test 3: Kiểm tra xử lý khi không tìm thấy sách
    it('Hiển thị lỗi khi không tìm thấy sách', fakeAsync(() => {
      const sachRong: Book | null = null;
      mockBookService.getBookById.and.returnValue(of(sachRong));
      component.ngOnInit();
      tick();
      expect(component.errorMessage).toBe('Không tìm thấy sách.');
    }));
  });

  describe('Chức năng đánh giá sao', () => {
    // Test 4: Kiểm tra chọn số sao
    it('Đặt số sao đánh giá chính xác', () => {
      component.setRating(4);
      expect(component.newReview.rating).toBe(4);
    });

    // Test 5: Kiểm tra hiệu ứng hover trên sao
    it('Xử lý hover trên sao đánh giá', () => {
      component.hoverRating(5);
      expect(component.hoveredRating).toBe(5);
    });

    // Test 6: Kiểm tra reset trạng thái hover
    it('Reset trạng thái hover', () => {
      component.resetHover();
      expect(component.hoveredRating).toBeNull();
    });
  });

  describe('Gửi đánh giá', () => {
    beforeEach(() => {
      component.newReview = {
        book_id: 1,
        user_id: 1,
        rating: 4,
        review_text: 'Bài đánh giá test',
      };
    });

    // Test 7: Kiểm tra gửi đánh giá thành công
    it('Gửi đánh giá thành công', fakeAsync(() => {
      mockBookReviewService.addReview.and.returnValue(of(mockDanhGia[0]));
      component.submitReview();
      tick();
      expect(component.successMessage).toBe(
        'Đánh giá đã được thêm thành công!'
      );
      tick(3000);
    }));

    // Test 8: Kiểm tra validation form đánh giá
    it('Kiểm tra thông tin đánh giá trước khi gửi', fakeAsync(() => {
      component.newReview.rating = 0;
      component.submitReview();
      tick();
      expect(component.errorMessage).toBe(
        'Vui lòng hoàn thành thông tin đánh giá.'
      );
      tick(3000);
    }));
  });

  describe('Chỉnh sửa đánh giá', () => {
    // Test 9: Kiểm tra bật chế độ chỉnh sửa
    it('Bật chế độ chỉnh sửa', () => {
      component.editReview(mockDanhGia[0]);
      expect(component.editingReviewId).toBe(mockDanhGia[0].review_id || null);
      expect(component.editableReview).toEqual(mockDanhGia[0]);
    });

    // Test 10: Kiểm tra lưu đánh giá sau khi chỉnh sửa
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

    // Test 11: Kiểm tra hủy chỉnh sửa
    it('Hủy chế độ chỉnh sửa', () => {
      component.editingReviewId = 1;
      component.cancelEdit();
      expect(component.editingReviewId).toBeNull();
      expect(component.editableReview).toEqual({});
    });
  });

  describe('Xóa đánh giá', () => {
    // Test 12: Kiểm tra xóa đánh giá thành công
    it('Xóa đánh giá thành công', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockBookReviewService.deleteReview.and.returnValue(of(void 0));
      component.deleteReview(1, 1);
      tick();
      expect(component.successMessage).toBe('Đánh giá đã được xóa thành công!');
      tick(3000);
    }));

    // Test 13: Kiểm tra hủy xóa đánh giá
    it('Không xóa khi người dùng hủy', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.deleteReview(1, 1);
      tick();
      expect(mockBookReviewService.deleteReview).not.toHaveBeenCalled();
    }));
  });

  describe('Giao diện người dùng', () => {
    // Test 14: Kiểm tra hiển thị thông tin sách
    it('Hiển thị thông tin sách', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent).toContain(mockSach.title);
    });

    // Test 15: Kiểm tra hiển thị form đánh giá
    it('Hiển thị form đánh giá khi chưa đánh giá', () => {
      component.hasUserReviewed = false;
      fixture.detectChanges();
      const reviewForm = fixture.debugElement.query(By.css('textarea'));
      expect(reviewForm).toBeTruthy();
    });

    // Test 16: Kiểm tra hiển thị danh sách đánh giá
    it('Hiển thị danh sách đánh giá', () => {
      const reviewElements = fixture.debugElement.queryAll(
        By.css('.review-item')
      );
      expect(reviewElements.length).toBe(mockDanhGia.length);
    });

    // Test 17: Kiểm tra hiển thị thông báo lỗi
    it('Hiển thị thông báo lỗi', () => {
      component.errorMessage = 'Lỗi test';
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement.nativeElement.textContent).toContain('Lỗi test');
    });
  });
});
