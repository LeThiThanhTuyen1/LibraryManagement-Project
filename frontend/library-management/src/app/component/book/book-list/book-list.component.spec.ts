import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from '../../../service/book.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookService: BookService;
  let router: Router;

  const mockBooks = [
    {
      book_id: 1,
      title: 'Lập trình Java',
      isbn: '9781234567890',
      publication_year: 2020,
      genre: 'Giáo trình',
      summary: 'Sách lập trình Java cơ bản',
      PublisherName: 'NXB Kim Đồng',
      AuthorName: 'Nguyễn Văn A',
      language: 'Tiếng Việt',
      file_path: '/path/java.pdf',
      AverageRating: 4.5,
      accessLevel: 'public',
      PublisherId: 1
    },
    {
      book_id: 2,
      title: 'Văn học Việt Nam',
      isbn: '9785678901234',
      publication_year: 2021,
      genre: 'Văn học',
      summary: 'Tuyển tập văn học Việt Nam hiện đại',
      PublisherName: 'NXB Khoa Học',
      AuthorName: 'Trần Văn B',
      language: 'Tiếng Việt',
      file_path: '/path/vanhoc.pdf',
      AverageRating: 4.0,
      accessLevel: 'private',
      PublisherId: 1
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [BookListComponent],
      providers: [
        BookService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books on initialization', () => {
    spyOn(bookService, 'getAllBooks').and.returnValue(of(mockBooks));

    component.ngOnInit();
    fixture.detectChanges();

    expect(bookService.getAllBooks).toHaveBeenCalled();
    expect(component.books.length).toBe(2);
    expect(component.books).toEqual(mockBooks);
  });

  it('should navigate to book detail on viewBook', () => {
    const bookId = 1;
    component.viewBook(bookId);

    expect(router.navigate).toHaveBeenCalledWith([`/book-detail/${bookId}`]);
  });

    // Bộ test cho chức năng phân quyền
    describe('Kiểm tra chức năng phân quyền truy cập', () => {
    
      // Kiểm tra việc tải role người dùng từ localStorage
      it('Nên tải được role người dùng từ localStorage chính xác', () => {
        // Chuẩn bị: Tạo dữ liệu giả lập cho localStorage
        const mockUser = { role: 'admin' };
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
  
        // Thực hiện: Gọi hàm loadUserRole
        component.loadUserRole();
  
        // Kiểm tra: Role đã được gán đúng chưa
        expect(component.userRole).toBe('admin');
      });
  
      // Kiểm tra xử lý lỗi khi đọc localStorage
      it('Nên xử lý được lỗi khi parse dữ liệu từ localStorage', () => {
        // Chuẩn bị: Tạo dữ liệu không hợp lệ trong localStorage
        spyOn(localStorage, 'getItem').and.returnValue('invalid-json');
        spyOn(console, 'error');
  
        // Thực hiện: Gọi hàm loadUserRole
        component.loadUserRole();
  
        // Kiểm tra: Log lỗi và userRole rỗng
        expect(console.error).toHaveBeenCalled();
        expect(component.userRole).toBe('');
      });
  
      // Kiểm tra cập nhật quyền truy cập thành công
      it('Nên cập nhật được quyền truy cập sách thành công', () => {
        // Chuẩn bị: Tạo mock cho service và sự kiện
        const bookId = 1;
        const mockEvent = { 
          target: { value: 'lecturer' } 
        } as unknown as Event;
        
        spyOn(bookService, 'updateBookAccessLevel').and.returnValue(of({}));
        spyOn(console, 'log');
  
        // Thực hiện: Gọi hàm updateAccessLevel
        component.updateAccessLevel(bookId, mockEvent);
  
        // Kiểm tra: Service được gọi với đúng tham số
        expect(bookService.updateBookAccessLevel).toHaveBeenCalledWith(bookId, 'lecturer');
        expect(console.log).toHaveBeenCalledWith('Access level updated successfully.');
      });
  
      // Kiểm tra xử lý lỗi khi cập nhật quyền truy cập
      it('Nên xử lý được lỗi khi cập nhật quyền truy cập thất bại', () => {
        // Chuẩn bị: Tạo mock cho service trả về lỗi
        const bookId = 1;
        const mockEvent = { 
          target: { value: 'lecturer' } 
        } as unknown as Event;
        
        spyOn(bookService, 'updateBookAccessLevel').and.returnValue(
          throwError(() => new Error('Cập nhật thất bại'))
        );
        spyOn(console, 'error');
        spyOn(window, 'alert');
  
        // Thực hiện: Gọi hàm updateAccessLevel
        component.updateAccessLevel(bookId, mockEvent);
  
        // Kiểm tra: Xử lý lỗi đúng cách
        expect(console.error).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Cập nhật cấp truy cập thất bại!');
      });
    });
  });