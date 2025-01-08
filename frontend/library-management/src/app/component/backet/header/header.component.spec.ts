import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Router, 
          useValue: { navigate: jasmine.createSpy('navigate') } 
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = router.navigate as jasmine.Spy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear localStorage and navigate to login on logout', () => {
    // Giả lập lưu thông tin người dùng vào localStorage
    localStorage.setItem('user', JSON.stringify({ last_name: 'Nguyen' }));

    // Gọi hàm onLogout
    component.onLogout();

    // Kiểm tra thông tin người dùng đã bị xóa khỏi localStorage
    expect(localStorage.getItem('user')).toBeNull();

    // Kiểm tra xem điều hướng về trang login có hoạt động
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
