import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookDetailComponent } from './book-detail.component';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let mockBookService: jasmine.SpyObj<BookService>;

  const mockBook: Book = {
    book_id: 1,
    title: 'Test Book',
    isbn: '1234567890',
    publication_year: 2021,
    publisher: {
      name: 'Test Publisher',
      publisher_id: 0,
      address: ''
    },
    genre: 'Test Genre',
    language: 'English',
    summary: 'This is a test summary.',
    file_path: 'https://example.com/book.pdf'
  };

  beforeEach(async () => {
    // Create a spy for BookService
    mockBookService = jasmine.createSpyObj('BookService', ['getBookById']);
    mockBookService.getBookById.and.returnValue(of(mockBook));

    await TestBed.configureTestingModule({
      declarations: [BookDetailComponent],
      providers: [
        { provide: BookService, useValue: mockBookService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' // Return '1' for book ID
              }
            }
          }
        }
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
  });

  it('should display book details in the template', () => {
    fixture.detectChanges(); // Triggers ngOnInit and renders template

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(mockBook.title);
    expect(compiled.querySelector('.book-info-item strong')?.textContent).toContain('ISBN:');
    expect(compiled.querySelector('.book-info-item')?.textContent).toContain(mockBook.isbn);
  });
});
