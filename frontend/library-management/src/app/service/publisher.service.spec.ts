import { TestBed } from '@angular/core/testing';
import { PublisherService } from './publisher.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

class MockHttpClient {
  get(url: string) {
    return of([]); // Giả lập phản hồi HTTP là một mảng trống
  }
}

describe('PublisherService', () => {
  let service: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PublisherService,
        { provide: HttpClient, useClass: MockHttpClient }, // Sử dụng mock HttpClient
      ],
    });
    service = TestBed.inject(PublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
