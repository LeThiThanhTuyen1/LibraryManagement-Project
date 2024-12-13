import { TestBed } from '@angular/core/testing';

import { BookadminService } from './bookadmin.service';

describe('BookadminService', () => {
  let service: BookadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
