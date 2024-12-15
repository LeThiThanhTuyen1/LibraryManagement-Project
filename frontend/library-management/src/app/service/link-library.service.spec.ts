import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LinkLibraryService } from './link-library.service';
import { LinkLibraries } from '../model/link-library.model';

describe('LinkLibraryService', () => {
  let service: LinkLibraryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LinkLibraryService]
    });
    service = TestBed.inject(LinkLibraryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Xác minh rằng không có request nào còn pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all link libraries', () => {
    const mockLibraries: LinkLibraries[] = [
      { 
        link_id: 1, 
        ten_thuvien: 'Thư viện 1', 
        link_text: 'http://library1.com',
        date_at: new Date()
      },
      { 
        link_id: 2, 
        ten_thuvien: 'Thư viện 2', 
        link_text: 'http://library2.com',
        date_at: new Date()
      }
    ];

    service.getLinkLibraries().subscribe(libraries => {
      expect(libraries).toEqual(mockLibraries);
    });

    const req = httpMock.expectOne('http://localhost:5283/api/LinkLibraries');
    expect(req.request.method).toBe('GET');
    req.flush(mockLibraries);
  });

  it('should get library by id', () => {
    const mockLibrary: LinkLibraries[] = [
      { 
        link_id: 1, 
        ten_thuvien: 'Thư viện 1', 
        link_text: 'http://library1.com',
        date_at: new Date()
      }
    ];
    const libraryId = 1;

    service.getLibraryById(libraryId).subscribe(library => {
      expect(library).toEqual(mockLibrary);
    });

    const req = httpMock.expectOne(`http://localhost:5283/api/LinkLibraries/${libraryId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLibrary);
  });
});
