import { TestBed } from '@angular/core/testing';

import { LecturerService } from './lecturer.service';
import { HttpClientModule } from '@angular/common/http';

describe('LecturerService', () => {
  let service: LecturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(LecturerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
