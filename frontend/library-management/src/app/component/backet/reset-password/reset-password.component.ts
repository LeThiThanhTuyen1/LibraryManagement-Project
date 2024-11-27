import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    this.authService.resetPassword(this.email, this.verificationCode, this.newPassword).subscribe({
      next: () => {
        alert('Đặt lại mật khẩu thành công!');
        this.router.navigate(['/login']);
      },
      error: err => {
        alert(err.error.message || 'Có lỗi xảy ra!');
      }
    });
  }

}
