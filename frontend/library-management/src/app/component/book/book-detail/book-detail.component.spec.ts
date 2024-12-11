import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookDetailComponent } from './book-detail.component';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Favorite } from '../../../model/favorite.model';
import { FavoriteService } from '../../../service/favorite.service';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let mockBookService: jasmine.SpyObj<BookService>;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;

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
    accessLevel: 'public'
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
    mockBookService = jasmine.createSpyObj('BookService', ['getBookById']);
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', ['addFavorite', 'deleteFavoriteByBookId']);

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
        { provide: Location, useValue: { back: jasmine.createSpy('back') } }
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
  
});
