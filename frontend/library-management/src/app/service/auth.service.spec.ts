import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../model/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login successfully', () => {
    const mockUser: User = { user_id: 1, username: '4451050437', password_hash: 'hashedpassword', first_name: 'Loan', last_name: 'Nhan', role: 'student', email: '2@gmail.com', phone_number: '07836787590'};

    service.login('4451050437', 'password').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:5283/api/Users/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser); // Giả lập dữ liệu trả về từ API
  });

  it('should handle login error', () => {
    service.login('wronguser', 'wrongpassword').subscribe({
      next: () => fail('Login should have failed'),
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('http://localhost:5283/api/Users/login');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
