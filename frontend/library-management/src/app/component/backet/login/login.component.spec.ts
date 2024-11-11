import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../service/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
    
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and navigate to home', () => {
    const mockUser = { user_id: 1, username: '4451050437', password_hash: 'hashedpassword', first_name: 'A', last_name: 'B', role: 'student', email: '2@gmail.com', phone_number: '0134234234' };
    mockAuthService.login.and.returnValue(of(mockUser)); // Giả lập trả về thành công

    component.username = '4451050437';
    component.password = 'password';
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('4451050437', 'password');
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.errorMessage).toBe('');
  });

  it('should show error message on login failure', () => {
    mockAuthService.login.and.returnValue(throwError({ status: 401 })); // Giả lập lỗi đăng nhập

    component.username = 'wronguser';
    component.password = 'wrongpassword';
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    expect(component.errorMessage).toBe('Tên đăng nhập hoặc mật khẩu không đúng.');
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
