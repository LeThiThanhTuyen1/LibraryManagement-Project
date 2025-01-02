import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookDetailComponent } from './book-detail.component';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Favorite } from '../../../model/favorite.model';
import { FavoriteService } from '../../../service/favorite.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as mammoth from 'mammoth';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let mockBookService: jasmine.SpyObj<BookService>;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;

  const mockBook: Book = {
    book_id: 1,
    title: 'Test Book',
    isbn: '1234567890',
    publication_year: 2021,
    genre: 'Test Genre',
    language: 'English',
    summary: 'This is a test summary.',
    file_path: 'https://example.com/book.pdf',
    PublisherName: 'Test Publisher',
    AuthorName: 'Test Author',
    AverageRating: 4,
    accessLevel: 'public',
    PublisherId: 0
  };

  const mockFavorite: Favorite = {
    favorite_id: 1, 
    book_id: 1, 
    user_id: 123, 
    added_date: new Date(),
    title: mockBook.title,
    name: mockBook.AuthorName
  };

  beforeEach(async () => {
    // Create spies for services
    mockBookService = jasmine.createSpyObj('BookService', ['getBookById', 'getBookFile', 'viewDocument']);
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', ['addFavorite', 'deleteFavoriteByBookId']);
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    mockSanitizer.bypassSecurityTrustResourceUrl.and.callFake(url => url);

    mockBookService.getBookById.and.returnValue(of(mockBook));
    mockFavoriteService.addFavorite.and.returnValue(of(mockFavorite)); 

    await TestBed.configureTestingModule({
      declarations: [BookDetailComponent],
      providers: [
        { provide: BookService, useValue: mockBookService },
        { provide: FavoriteService, useValue: mockFavoriteService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }) 
          }
        },
        { provide: Location, useValue: { back: jasmine.createSpy('back') } },
        { provide: DomSanitizer, useValue: mockSanitizer }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load book details on initialization', () => {
    fixture.detectChanges();

    expect(mockBookService.getBookById).toHaveBeenCalledWith(1); 
    expect(component.book).toEqual(mockBook);
    expect(component.isLoading).toBeFalse(); 
  });

  it('should display book details after loading', () => {
    component.book = mockBook; // Mock dữ liệu sách
    component.isLoading = false; // Đã tải xong
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
  
    // Kiểm tra ISBN
    expect(compiled.querySelector('.book-info-item:nth-child(2)')?.textContent).toContain('ISBN:');
    expect(compiled.querySelector('.book-info-item:nth-child(2)')?.textContent).toContain(mockBook.isbn);
  
    // Kiểm tra tác giả
    expect(compiled.querySelector('.book-info-item:first-child')?.textContent).toContain('Tác giả:');
    expect(compiled.querySelector('.book-info-item:first-child')?.textContent).toContain(mockBook.AuthorName);
  });   

  // it('should show loading message while fetching data', () => {
  //   component.isLoading = true; // Giả lập trạng thái đang tải
  //   fixture.detectChanges();
  
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.loading')?.textContent).toContain('Đang tải dữ liệu...');
  // });  
  
  // it('should toggle favorite status when the favorite button is clicked', () => {
  //   component.book = mockBook;
  //   component.isFavorite = false; // Ban đầu chưa yêu thích
  //   fixture.detectChanges();
  
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const favoriteButton = compiled.querySelector('.favorite-btn i') as HTMLElement;
  
  //   // Click để thêm yêu thích
  //   favoriteButton.click();
  //   fixture.detectChanges();
  
  //   // Kiểm tra thay đổi class sau khi click
  //   expect(favoriteButton.className).toContain('fas fa-heart');
  // });  

  it('should go back when the back button is clicked', () => {
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.btn-goback') as HTMLButtonElement;
    backButton.click();
  
    expect(TestBed.inject(Location).back).toHaveBeenCalled();
  });  
  
  describe('downloadDocument', () => {
    let localStorageGetItemSpy: jasmine.Spy;

    beforeEach(() => {
      localStorageGetItemSpy = spyOn(window.localStorage, 'getItem');
      // Mặc định là admin user
      localStorageGetItemSpy.and.returnValue(JSON.stringify({
        user_id: 1,
        role: 'admin'
      }));
    });

    it('nên cho phép admin tải tài liệu', () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      mockBookService.getBookFile.and.returnValue(of(mockBlob));
      
      component.book = {
        ...mockBook,
        accessLevel: 'private'
      };
      
      const createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:url');
      const revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');
      
      const mockAnchor = {
        href: '',
        download: '',
        click: jasmine.createSpy('click')
      };
      spyOn(document, 'createElement').and.returnValue(mockAnchor as any);
      
      component.downloadDocument();
      
      expect(mockBookService.getBookFile).toHaveBeenCalledWith(mockBook.book_id);
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Tải tài liệu thành công!');
    });

    it('nên hiển thị thông báo khi chưa đăng nhập', () => {
      localStorageGetItemSpy.and.returnValue(null);
      
      component.downloadDocument();
      
      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Vui lòng đăng nhập để tải tài liệu.');
      expect(mockBookService.getBookFile).not.toHaveBeenCalled();
    });

    it('nên hiển thị thông báo từ chối quyền truy cập cho người dùng không được phép', () => {
      localStorageGetItemSpy.and.returnValue(JSON.stringify({
        user_id: 1,
        role: 'user'
      }));
      
      component.book = {
        ...mockBook,
        accessLevel: 'private'
      };
      
      component.downloadDocument();
      
      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Bạn không có quyền tải tài liệu này.');
      expect(mockBookService.getBookFile).not.toHaveBeenCalled();
    });

    it('nên xử lý lỗi khi tải tài liệu thất bại', () => {
      mockBookService.getBookFile.and.returnValue(throwError(() => new Error('Download failed')));
      
      component.book = mockBook;
      
      component.downloadDocument();
      
      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.');
    });
  });

  describe('viewDocument', () => {
    let localStorageGetItemSpy: jasmine.Spy;
    let createObjectURLSpy: jasmine.Spy;

    beforeEach(() => {
      localStorageGetItemSpy = spyOn(localStorage, 'getItem');
      localStorageGetItemSpy.and.returnValue(JSON.stringify({
        user_id: 1,
        role: 'admin'
      }));
      createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:test-url');
      component.book = mockBook;
    });

    it('nên xử lý tài liệu PDF đúng cách', () => {
      const pdfBlob = new Blob(['fake pdf content'], { type: 'application/pdf' });
      mockBookService.viewDocument.and.returnValue(of(pdfBlob));

      component.viewDocument();

      expect(mockBookService.viewDocument).toHaveBeenCalledWith(mockBook.book_id);
      expect(createObjectURLSpy).toHaveBeenCalledWith(pdfBlob);
      expect(mockSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('blob:test-url');
      expect(component.documentUrl).toBeTruthy();
    });

    it('nên hiển thị thông báo lỗi khi tải tài liệu thất bại', () => {
      mockBookService.viewDocument.and.returnValue(
        throwError(() => new Error('Failed to load document'))
      );

      component.viewDocument();

      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.');
    });

    it('nên hiển thị thông báo từ chối quyền truy cập cho người dùng không được phép', () => {
      localStorageGetItemSpy.and.returnValue(JSON.stringify({
        user_id: 1,
        role: 'user'
      }));
      
      component.book = {
        ...mockBook,
        accessLevel: 'private'
      };

      component.viewDocument();

      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Bạn không có quyền truy cập tài liệu này.');
      expect(mockBookService.viewDocument).not.toHaveBeenCalled();
    });

    it('nên yêu cầu đăng nhập để xem tài liệu', () => {
      localStorageGetItemSpy.and.returnValue(null);

      component.viewDocument();

      expect(component.showDialog).toBeTrue();
      expect(component.dialogMessage).toBe('Vui lòng đăng nhập để xem tài liệu.');
      expect(mockBookService.viewDocument).not.toHaveBeenCalled();
    });

    it('nên đóng trình xem tài liệu đúng cách', () => {
      const revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');
      component.tempFileUrl = 'blob:test-url';
      component.documentUrl = 'test-url';

      component.closeDocumentViewer();

      expect(component.documentUrl).toBe('');
      expect(component.tempFileUrl).toBe('');
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-url');
    });
  });
});
