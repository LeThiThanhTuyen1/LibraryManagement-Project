import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchDocumentsComponent } from './search-documents.component';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { of } from 'rxjs';

/**
 * Test suite cho SearchDocumentsComponent
 * Tổng cộng: 12 test cases
 * Phân loại:
 * - 1 test khởi tạo component
 * - 1 test khởi tạo dữ liệu
 * - 7 test chức năng tìm kiếm
 * - 1 test tìm không thấy kết quả
 * - 1 test chức năng đặt lại
 * - 1 test chức năng xem chi tiết
 */

describe('SearchDocumentsComponent', () => {
  let component: SearchDocumentsComponent;
  let fixture: ComponentFixture<SearchDocumentsComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  // Mock data
  const mockBooks: Book[] = [
    {
      book_id: 1,
      title: 'Angular Development',
      AuthorName: 'John Doe',
      publication_year: 2023,
      isbn: '123456789',
      genre: 'Programming',
      language: 'English',
      summary: 'Test Summary',
      PublisherName: 'Tech Books',
      PublisherId: 1,
      file_path: 'path/to/file',
      AverageRating: 4.5,
      accessLevel: 'public',
    },
    {
      book_id: 2,
      title: 'TypeScript Basics',
      AuthorName: 'Jane Smith',
      publication_year: 2024,
      isbn: '987654321',
      genre: 'Programming',
      language: 'Vietnamese',
      summary: 'Another Summary',
      PublisherName: 'Tech Books',
      PublisherId: 1,
      file_path: 'path/to/another/file',
      AverageRating: 4.0,
      accessLevel: 'public',
    },
  ];

  const mockGenres = ['Programming', 'Science', 'Fiction'];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getAllBooks',
      'getGenres',
      'getBookById',
    ]);

    await TestBed.configureTestingModule({
      declarations: [SearchDocumentsComponent],
      imports: [HttpClientModule, FormsModule],
      providers: [{ provide: BookService, useValue: bookServiceSpy }],
    }).compileComponents();

    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    fixture = TestBed.createComponent(SearchDocumentsComponent);
    component = fixture.componentInstance;
  });

  /**
   * Test case #1: Kiểm tra khởi tạo component
   * Mục đích: Đảm bảo component được tạo thành công
   */
  it('Khởi Tạo Component ', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test case #2: Kiểm tra khởi tạo dữ liệu
   * Mục đích:
   * - Kiểm tra việc load danh sách sách từ service
   * - Kiểm tra việc load danh sách thể loại từ service
   * - Kiểm tra dữ liệu được gán đúng vào component
   */
  it('Kiểm tra khởi tạo dữ liệu', () => {
    bookService.getAllBooks.and.returnValue(of(mockBooks));
    bookService.getGenres.and.returnValue(of(mockGenres));

    component.ngOnInit();

    expect(bookService.getAllBooks).toHaveBeenCalled();
    expect(bookService.getGenres).toHaveBeenCalled();
    expect(component.books).toEqual(mockBooks);
    expect(component.genres).toEqual(mockGenres);
  });

  /**
   * Test suite cho chức năng tìm kiếm
   * Gồm 7 test cases kiểm tra các tiêu chí tìm kiếm khác nhau
   */
  describe('Chức năng tìm kiếm', () => {
    beforeEach(() => {
      component.allBooks = mockBooks;
    });

    /**
     * Test case #3: Tìm kiếm theo tiêu đề
     * Đầu vào: Tiêu đề "Angular"
     * Kết quả mong đợi: 1 sách có tiêu đề chứa từ "Angular"
     */
    it(' lọc sách theo tiêu đề', () => {
      component.searchCriteria.title = 'Angular';
      component.searchBooks();
      expect(component.books.length).toBe(1);
      expect(component.books[0].title).toContain('Angular');
    });

    /**
     * Test case #4: Tìm kiếm theo tác giả
     * Đầu vào: Tên tác giả "John"
     * Kết quả mong đợi: 1 sách của tác giả có tên chứa "John"
     */
    it(' lọc sách theo tên tác giả', () => {
      component.searchCriteria.AuthorName = 'John';
      component.searchBooks();
      expect(component.books.length).toBe(1);
      expect(component.books[0].AuthorName).toContain('John');
    });

    /**
     * Test case #5: Tìm kiếm theo thể loại
     * Đầu vào: Thể loại "Programming"
     * Kết quả mong đợi: 2 sách thuộc thể loại "Programming"
     */
    it(' lọc sách theo thể loại', () => {
      component.searchCriteria.genre = 'Programming';
      component.searchBooks();
      expect(component.books.length).toBe(2);
    });

    /**
     * Test case #6: Tìm kiếm theo năm xuất bản
     * Đầu vào: Năm 2023
     * Kết quả mong đợi: 1 sách xuất bản năm 2023
     */
    it(' lọc sách theo năm xuất bản', () => {
      component.searchCriteria.publication_year = 2023;
      component.searchBooks();
      expect(component.books.length).toBe(1);
      expect(component.books[0].publication_year).toBe(2023);
    });

    /**
     * Test case #7: Tìm kiếm theo ISBN
     * Đầu vào: ISBN "123456789"
     * Kết quả mong đợi: 1 sách có mã ISBN tương ứng
     */
    it(' lọc sách theo ISBN', () => {
      component.searchCriteria.isbn = '123456789';
      component.searchBooks();
      expect(component.books.length).toBe(1);
      expect(component.books[0].isbn).toBe('123456789');
    });

    /**
     * Test case #8: Tìm kiếm theo ngôn ngữ
     * Đầu vào: Ngôn ngữ "Vietnamese"
     * Kết quả mong đợi: 1 sách bằng tiếng Việt
     */
    it(' lọc sách theo ngôn ngữ', () => {
      component.searchCriteria.language = 'Vietnamese';
      component.searchBooks();
      expect(component.books.length).toBe(1);
      expect(component.books[0].language).toBe('Vietnamese');
    });

    /**
     * Test case #9: Tìm kiếm với nhiều tiêu chí
     * Đầu vào:
     * - Thể loại: "Programming"
     * - Ngôn ngữ: "English"
     * Kết quả mong đợi: 1 sách thỏa mãn cả 2 điều kiện
     */
    it(' xử lý nhiều tiêu chí tìm kiếm cùng lúc', () => {
      component.searchCriteria = {
        genre: 'Programming',
        language: 'English',
      };
      component.searchBooks();
      expect(component.books.length).toBe(1);
      expect(component.books[0].title).toBe('Angular Development');
    });

    /**
     * Test case #10: Kiểm tra không tìm thấy kết quả
     * Đầu vào: Tiêu đề không tồn tại "NonexistentBook"
     * Kết quả mong đợi:
     * - Không có sách nào được tìm thấy
     * - Cờ noBooksFound được bật true
     */
    it(' Nhập sai thông tin ', () => {
      component.searchCriteria.title = 'NonexistentBook';
      component.searchBooks();
      expect(component.books.length).toBe(0);
      expect(component.noBooksFound).toBeTrue();
    });
  });

  /**
   * Test case #11: Kiểm tra chức năng đặt lại tìm kiếm
   * Mục đích:
   * - Xóa tất cả tiêu chí tìm kiếm
   * - Khôi phục lại danh sách sách ban đầu
   * - Đặt lại trạng thái noBooksFound
   */
  describe('Chức năng đặt lại', () => {
    it(' đặt lại tiêu chí tìm kiếm và khôi phục danh sách sách ban đầu', () => {
      component.allBooks = mockBooks;
      component.searchCriteria = {
        title: 'Test',
        genre: 'Programming',
        AuthorName: 'John',
      };

      component.resetSearch();

      expect(component.searchCriteria).toEqual({});
      expect(component.books).toEqual(mockBooks);
      expect(component.noBooksFound).toBeFalse();
    });
  });

  /**
   * Test case #12: Kiểm tra xem chi tiết sách
   * Mục đích:
   * - Kiểm tra việc gọi service lấy thông tin sách theo ID
   * - Kiểm tra việc gán dữ liệu vào selectedBook
   */
  describe('Chức năng xem chi tiết sách', () => {
    it('lấy được chi tiết sách theo ID', () => {
      const testBook = mockBooks[0];
      bookService.getBookById.and.returnValue(of(testBook));

      component.getBookById(1);

      expect(bookService.getBookById).toHaveBeenCalledWith(1);
      expect(component.selectedBook).toEqual(testBook);
    });
  });
});
