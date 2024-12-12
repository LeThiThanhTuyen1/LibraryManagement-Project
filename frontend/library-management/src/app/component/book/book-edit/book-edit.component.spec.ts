import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookEditComponent } from './book-edit.component';
import { BookService } from '../../../service/book.service';
import { PublisherService } from '../../../service/publisher.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load publishers on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    
    expect(mockPublisherService.getAllPublishers).toHaveBeenCalled();
    expect(component.publishers.length).toBe(2);
    expect(component.publishers[0].name).toBe('Test Publisher');
  }));

  it('should load the book data on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    
    expect(mockBookService.getBookById).toHaveBeenCalledWith(1);
    expect(component.bookForm.get('title')?.value).toBe('Test Book');
    expect(component.bookForm.get('isbn')?.value).toBe('1234567890');
  }));

  it('should save changes', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const updatedBookData = {
      title: 'Updated Title',
      isbn: '0987654321',
      publication_year: 2024,
      genre: 'Non-Fiction',
      summary: 'Updated summary.',
      language: 'Spanish',
      PublisherId: 2
    };

    component.bookForm.patchValue(updatedBookData);

    mockBookService.updateBook.and.returnValue(of({ success: true }));

    component.onSubmit();
    tick();

    expect(mockBookService.updateBook).toHaveBeenCalledWith(1, jasmine.objectContaining({
      title: 'Updated Title',
      isbn: '0987654321',
      publication_year: 2024,
      genre: 'Non-Fiction',
      summary: 'Updated summary.',
      language: 'Spanish',
      publisherId: 2,
      file_path: 'moi.pdf'
    }));
  }));

  it('should navigate back to the book list on cancel', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/book-list']);
  });
});