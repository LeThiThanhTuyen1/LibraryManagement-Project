import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: any): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      // Hiển thị thông báo yêu cầu đăng nhập
      alert('Bạn cần đăng nhập để truy cập chức năng này.');
      // Điều hướng đến trang login
      this.router.navigate(['/login']);
      return false;
    }

    // Kiểm tra vai trò người dùng từ localStorage
    const storedUser = localStorage.getItem('user');
    console.log(storedUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userRole = user.role; // Lấy vai trò của người dùng
      
      // Kiểm tra route yêu cầu quyền admin
      if (route.data?.role && userRole !== 'admin') {
        // Nếu không phải admin, hiển thị thông báo
        alert('Bạn không có quyền truy cập chức năng này.');
        // Điều hướng về trang user
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}
