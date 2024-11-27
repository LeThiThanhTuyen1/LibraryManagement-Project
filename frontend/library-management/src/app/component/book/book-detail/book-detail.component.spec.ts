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
    AverageRating: 4
  };

  const mockFavorite: Favorite = {
    favorite_id: 1, 
    book_id: 1, 
    user_id: 123, // Mock user ID
    added_date: new Date(),
    title: mockBook.title,
    name: mockBook.AuthorName
  };

  beforeEach(async () => {
    // Create spies for services
    mockBookService = jasmine.createSpyObj('BookService', ['getBookById']);
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', ['addFavorite', 'deleteFavoriteByBookId']);

    mockBookService.getBookById.and.returnValue(of(mockBook));
    mockFavoriteService.addFavorite.and.returnValue(of(mockFavorite)); // Return a Favorite object

    await TestBed.configureTestingModule({
      declarations: [BookDetailComponent],
      providers: [
        { provide: BookService, useValue: mockBookService },
        { provide: FavoriteService, useValue: mockFavoriteService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }) // Mock route parameter for book ID
          }
        },
        { provide: Location, useValue: { back: jasmine.createSpy('back') } }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Suppress errors for custom elements like 'app-header'
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load book details on initialization', () => {
    fixture.detectChanges(); // Triggers ngOnInit

    expect(mockBookService.getBookById).toHaveBeenCalledWith(1); // Check if getBookById was called with ID 1
    expect(component.book).toEqual(mockBook); // Check if the book details are set correctly
    expect(component.isLoading).toBeFalse(); // Ensure loading is false after data is fetched
  });

  it('should display loading message while data is being loaded', () => {
    component.isLoading = true; // Simulate loading state
    fixture.detectChanges(); // Trigger change detection

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading')?.textContent).toContain('Đang tải dữ liệu...');
  });

  it('should display book details after loading', () => {
    component.isLoading = false;
    fixture.detectChanges(); // Trigger change detection after setting book data

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(mockBook.title);
    expect(compiled.querySelector('.book-info-item')?.textContent).toContain('ISBN:');
    expect(compiled.querySelector('.book-info-item')?.textContent).toContain(mockBook.isbn);
  });

  it('should toggle favorite status when favorite button is clicked', () => {
    component.isFavorite = false;
    component.book = mockBook; // Set book data

    mockFavoriteService.addFavorite.and.returnValue(of(mockFavorite)); // Mock adding favorite
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const favoriteButton = compiled.querySelector('.favorite-btn') as HTMLButtonElement;
    favoriteButton.click(); // Simulate button click

    expect(mockFavoriteService.addFavorite).toHaveBeenCalledWith(jasmine.objectContaining({ book_id: 1 }));
    expect(component.isFavorite).toBeTrue(); // Check if favorite status is updated
  });

  it('should go back when the back button is clicked', () => {
    fixture.detectChanges(); // Trigger change detection

    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.btn.btn-goback') as HTMLButtonElement;
    backButton.click(); // Simulate back button click

    expect(component.locationService).toHaveBeenCalled(); // Check if back() was called
  });
});
