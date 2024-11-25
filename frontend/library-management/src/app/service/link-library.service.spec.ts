import { TestBed } from '@angular/core/testing';

import { LinkLibraryService } from './link-library.service';

describe('LinkLibraryService', () => {
  let service: LinkLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
