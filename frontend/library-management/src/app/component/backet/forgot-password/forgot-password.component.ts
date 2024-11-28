import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        alert('Mã xác nhận đã được gửi qua email.');
        this.router.navigate(['/reset-password']); // Sử dụng Router để điều hướng
      },
      error: err => {
        alert(err.error.message || 'Có lỗi xảy ra!');
      }
    });
  }
}
