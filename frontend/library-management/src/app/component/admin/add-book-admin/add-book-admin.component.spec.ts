import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddBookAdminComponent } from './add-book-admin.component';
import { BookAdminService } from '../../../service/bookadmin.service';
import { of, throwError } from 'rxjs';

describe('AddBookAdminComponent', () => {
  let component: AddBookAdminComponent;
  let fixture: ComponentFixture<AddBookAdminComponent>;
  let bookAdminService: jasmine.SpyObj<BookAdminService>;

  beforeEach(async () => {
    const bookAdminSpy = jasmine.createSpyObj('BookAdminService', ['addBook', 'uploadFile']);
    
    await TestBed.configureTestingModule({
      declarations: [AddBookAdminComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: BookAdminService, useValue: bookAdminSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBookAdminComponent);
    component = fixture.componentInstance;
    bookAdminService = TestBed.inject(BookAdminService) as jasmine.SpyObj<BookAdminService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.addBookForm.get('title')?.value).toBe('');
    expect(component.addBookForm.get('isbn')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.addBookForm;
    expect(form.valid).toBeFalsy();

    form.controls['title'].setValue('Test Book');
    form.controls['isbn'].setValue('1234567890');

    expect(form.valid).toBeTruthy();
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    component.onFileChange(mockEvent);
    expect(component.selectedFile).toEqual(mockFile);
  });

  it('should submit form successfully', () => {
    const mockResponse = { success: true };
    bookAdminService.addBook.and.returnValue(of(mockResponse));

    component.addBookForm.patchValue({
      title: 'Test Book',
      isbn: '1234567890',
      publisherName: 'Test Publisher',
      authorName: 'Test Author'
    });

    spyOn(window, 'alert');
    component.onSubmit();

    expect(bookAdminService.addBook).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Thêm sách thành công!');
  });

  it('should handle submission error', () => {
    bookAdminService.addBook.and.returnValue(throwError(() => new Error('Error')));

    component.addBookForm.patchValue({
      title: 'Test Book',
      isbn: '1234567890'
    });

    spyOn(window, 'alert');
    spyOn(console, 'error');
    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Thêm sách thất bại, vui lòng thử lại!');
  });
});
