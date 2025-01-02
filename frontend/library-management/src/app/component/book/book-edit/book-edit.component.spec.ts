import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookEditComponent } from './book-edit.component';
import { BookService } from '../../../service/book.service';
import { PublisherService } from '../../../service/publisher.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let mockBookService: any;
  let mockPublisherService: any;
  let router: Router;

  // Định nghĩa routes test
  const routes: Routes = [
    { path: 'book-list', component: BookEditComponent },
    { path: 'book-edit/:id', component: BookEditComponent }
  ];

  beforeEach(async () => {
    mockBookService = jasmine.createSpyObj('BookService', ['getBookById', 'updateBook']);
    mockPublisherService = jasmine.createSpyObj('PublisherService', ['getAllPublishers']);

    // Mock localStorage
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return JSON.stringify({ role: 'admin' });
      }
    };
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);

    mockBookService.getBookById.and.returnValue(of({
      book_id: 1,
      title: 'Test Book',
      isbn: '1234567890',
      publication_year: 2023,
      genre: 'Fiction',
      summary: 'This is a test book.',
      language: 'English',
      file_path: 'moi.pdf',
      publisher: {
        publisher_id: 1,
        name: 'Test Publisher',
        address: 'Test Address'
      },
      accessLevel: 'Public'
    }));

    mockPublisherService.getAllPublishers.and.returnValue(of([
      { publisher_id: 1, name: 'Test Publisher', address: 'Test Address' },
      { publisher_id: 2, name: 'Another Publisher', address: 'Another Address' }
    ]));

    await TestBed.configureTestingModule({
      declarations: [BookEditComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: BookService, useValue: mockBookService },
        { provide: PublisherService, useValue: mockPublisherService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
  });

  it('nên tạo được component', () => {
    expect(component).toBeTruthy();
  });

  it('nên tải được danh sách nhà xuất bản khi khởi tạo', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    
    expect(mockPublisherService.getAllPublishers).toHaveBeenCalled();
    expect(component.publishers.length).toBe(2);
    expect(component.publishers[0].name).toBe('Test Publisher');
  }));

  it('nên tải được thông tin sách khi khởi tạo', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    
    expect(mockBookService.getBookById).toHaveBeenCalledWith(1);
    expect(component.bookForm.get('title')?.value).toBe('Test Book');
    expect(component.bookForm.get('isbn')?.value).toBe('1234567890');
  }));

  it('nên lưu được các thay đổi', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const duLieuCapNhat = {
      title: 'Tiêu đề mới',
      isbn: '0987654321',
      publication_year: 2024,
      genre: 'Phi hư cấu',
      summary: 'Tóm tắt mới.',
      language: 'Tiếng Việt',
      PublisherId: 2
    };

    component.bookForm.patchValue(duLieuCapNhat);

    mockBookService.updateBook.and.returnValue(of({ success: true }));

    component.onSubmit();
    tick(2000);

    expect(mockBookService.updateBook).toHaveBeenCalledWith(1, jasmine.objectContaining({
      title: 'Tiêu đề mới',
      isbn: '0987654321',
      publication_year: 2024,
      genre: 'Phi hư cấu',
      summary: 'Tóm tắt mới.',
      language: 'Tiếng Việt',
      publisherId: 2,
      file_path: 'moi.pdf'
    }));
  }));

  it('nên chuyển về trang danh sách khi nhấn hủy', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/book-list']);
  });

  it('nên chuyển hướng người dùng không phải admin về trang danh sách', fakeAsync(() => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify({ role: 'user' }));
    
    const navigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
    tick(2000);
    
    expect(component.showDialog).toBeTrue();
    expect(component.dialogMessage).toBe('Bạn không có quyền truy cập trang này.');
    expect(navigateSpy).toHaveBeenCalledWith(['/book-list']);
  }));

  it('nên xử lý lỗi khi form không hợp lệ', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Đặt giá trị không hợp lệ cho form
    component.bookForm.patchValue({
      title: '', // trường bắt buộc
      isbn: '',  // trường bắt buộc
      publication_year: null // trường bắt buộc
    });

    component.onSubmit();
    tick();

    expect(component.showDialog).toBeTrue();
    expect(component.dialogMessage).toBe('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
    expect(mockBookService.updateBook).not.toHaveBeenCalled();
  }));

  it('nên xử lý lỗi từ máy chủ khi cập nhật', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Đảm bảo form hợp lệ
    component.bookForm.patchValue({
      title: 'Tiêu đề hợp lệ',
      isbn: '1234567890',
      publication_year: 2024,
      PublisherId: 1,
      genre: 'Văn học',
      summary: 'Tóm tắt test',
      language: 'Tiếng Việt'
    });

    expect(component.bookForm.valid).toBeTrue();

    mockBookService.updateBook.and.returnValue(throwError(() => new Error('Lỗi máy chủ')));

    component.onSubmit();
    tick(2000);

    expect(component.showDialog).toBeTrue();
    expect(component.dialogMessage).toBe('Cập nhật sách thất bại. Vui lòng thử lại!');
  }));

  it('nên đóng được dialog khi gọi closeDialog', () => {
    component.showDialog = true;
    component.dialogMessage = 'Thông báo test';
    
    component.closeDialog();
    
    expect(component.showDialog).toBeFalse();
    expect(component.dialogMessage).toBe('');
  });
});