import { TestBed } from '@angular/core/testing';

import { BookAdminService } from './bookadmin.service';

describe('BookadminService', () => {
  let service: BookAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
