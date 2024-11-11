import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        console.log(user);
        // Lưu trữ thông tin người dùng
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Đăng nhập thành công.');
        
        if (user.role === 'admin') {
          // Nếu là admin, điều hướng đến trang /admin-home
          this.router.navigate(['/home-admin']);
        } else {
          // Nếu không phải admin, điều hướng đến trang /home
          this.router.navigate(['/home']);
        }
      }, 
      error: (err) => {
        // Hiển thị thông báo lỗi khi đăng nhập thất bại
        this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        console.error('Đăng nhập thất bại', err);
      }
    });
  }
}
