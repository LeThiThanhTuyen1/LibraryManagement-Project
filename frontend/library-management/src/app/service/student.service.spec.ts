import { TestBed } from '@angular/core/testing';

import { StudentService } from './student.service';
import { HttpClientModule } from '@angular/common/http';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
