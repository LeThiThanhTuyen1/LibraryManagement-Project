import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookAdminService } from './bookadmin.service';

describe('BookAdminService', () => {
  let service: BookAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookAdminService]
    });
    service = TestBed.inject(BookAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload file', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const mockResponse = { filePath: 'uploads/test.pdf' };

    service.uploadFile(mockFile).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5283/api/upload');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should add book', () => {
    const mockBook = {
      title: 'Test Book',
      isbn: '1234567890',
      publisherName: 'Test Publisher',
      authorName: 'Test Author'
    };
    const mockResponse = { success: true };

    service.addBook(mockBook).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5283/api/BookAdmin/add');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
