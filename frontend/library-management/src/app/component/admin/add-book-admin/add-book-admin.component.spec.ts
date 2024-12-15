import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddBookAdminComponent } from './add-book-admin.component';
import { BookAdminService } from '../../../service/bookadmin.service';
import { of, throwError } from 'rxjs';

class MockBookAdminService {
  addBook() {
    return of({ message: 'Success' }); // Mock response khi thành công
  }
}

describe('AddBookAdminComponent', () => {
  let component: AddBookAdminComponent;
  let fixture: ComponentFixture<AddBookAdminComponent>;
  let bookAdminService: BookAdminService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBookAdminComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: BookAdminService, useClass: MockBookAdminService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBookAdminComponent);
    component = fixture.componentInstance;
    bookAdminService = TestBed.inject(BookAdminService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.addBookForm.value).toEqual({
      title: '',
      isbn: '',
      publicationYear: '',
      language: '',
      summary: '',
      genre: '',
      authorName: '',
      authorNationality: '',
      authorBirthYear: null,
      publisherName: '',
      publisherAddress: '',
      publisherPhone: ''
    });
  });

  it('should not allow form submission when invalid', () => {
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Vui lòng nhập đầy đủ thông tin hợp lệ và chọn file!');
  });

  it('should validate file type and mark it invalid if unsupported', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileChange(event);
    expect(component.isFileValid).toBe(true);
    expect(component.selectedFile).toEqual(mockFile);

    const invalidFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const invalidEvent = { target: { files: [invalidFile] } } as unknown as Event;

    component.onFileChange(invalidEvent);
    expect(component.isFileValid).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('File không hợp lệ.');
  });

  it('should call bookAdminService.addBook() on valid form submission', () => {
    spyOn(bookAdminService, 'addBook').and.callThrough();
    spyOn(window, 'alert');

    // Set form values
    component.addBookForm.patchValue({
      title: 'Test Book',
      isbn: '123456789',
      publicationYear: 2023,
      language: 'English'
    });

    // Mock valid file
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = mockFile;
    component.isFileValid = true;

    component.onSubmit();

    expect(bookAdminService.addBook).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Thêm sách thành công!');
    expect(component.addBookForm.value.title).toBe('');
  });

  it('should handle error from bookAdminService.addBook()', () => {
    spyOn(bookAdminService, 'addBook').and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');

    // Set form values
    component.addBookForm.patchValue({
      title: 'Test Book',
      isbn: '123456789',
      publicationYear: 2023,
      language: 'English'
    });

    // Mock valid file
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = mockFile;
    component.isFileValid = true;

    component.onSubmit();

    expect(bookAdminService.addBook).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Thêm sách thất bại, vui lòng thử lại!');
  });
});
