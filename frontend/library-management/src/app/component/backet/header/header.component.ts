import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userLastName: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Lấy thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userLastName = user.last_name; // Lấy last_name từ thông tin user
    }
  }

  onLogout(): void {
    // Xóa thông tin người dùng khỏi localStorage khi đăng xuất
    localStorage.removeItem('user');
    // Điều hướng về trang đăng nhập
    this.router.navigate(['/login']);
  }
}
