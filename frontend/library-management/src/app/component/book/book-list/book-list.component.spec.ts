import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from '../../../service/book.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

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
      summary: 'Sách lập trình Java co bản',
      language: 'Tiếng Việt',
      file_path: '/path/java.pdf',
      publisher: { publisher_id: 1, name: 'NXB Kim Đồng', address: 'Hà Nội' }
    },
    {
      book_id: 2,
      title: 'Văn học Việt Nam',
      isbn: '9785678901234',
      publication_year: 2021,
      genre: 'Văn học',
      summary: 'Tuyển tập van học Việt Nam hiện đại',
      language: 'Tiếng Việt',
      file_path: '/path/vanhoc.pdf',
      publisher: { publisher_id: 5, name: 'NXB Khoa Học', address: 'Huế' }
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
    spyOn(bookService, 'getBooks').and.returnValue(of(mockBooks));

    component.ngOnInit();
    fixture.detectChanges();

    expect(bookService.getBooks).toHaveBeenCalled();
    expect(component.books.length).toBe(2);
    expect(component.books).toEqual(mockBooks);
  });

  it('should navigate to book detail on viewBook', () => {
    const bookId = 1;
    component.viewBook(bookId);

    expect(router.navigate).toHaveBeenCalledWith([`/book-detail/${bookId}`]);
  });
});
