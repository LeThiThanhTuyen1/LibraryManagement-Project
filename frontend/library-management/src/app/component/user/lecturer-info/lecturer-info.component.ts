import { Component, OnInit } from '@angular/core';
import { LecturerService } from '../../../service/lecturer.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-lecturer-info',
  templateUrl: './lecturer-info.component.html',
  styleUrls: ['./lecturer-info.component.css']
})
export class LecturerInfoComponent implements OnInit {
  lecturer: any = null;
  isEditing = false;
  userId: number = 0;
  originalUser: any;
  errorMessage: string = '';

  isChangingPassword = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private lecturerService: LecturerService, private userService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id;

    if (this.userId) {
      this.loadLecturerInfo();
    }
  }

  // Load lecturer information from the API
  loadLecturerInfo() {
    this.lecturerService.getLecturerDetailsByUserId(this.userId).subscribe(
      (response: any) => {
        this.lecturer = response;
        // Populate user phone number with data from API response
        this.lecturer.PhoneNumber = this.lecturer.PhoneNumber || '';
      },
      (error) => {
        console.error('Error fetching lecturer data:', error);
      }
    );
  }

  // Enable editing of the form
  enableEditing() {
    this.isEditing = true;
    this.originalUser = { ...this.lecturer }; 
  }

  // Save changes to the lecturer information
  saveChanges() {
    this.errorMessage = ''; 
  
    // Validate email on frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.lecturer.Email)) {
      this.errorMessage = 'Email không hợp lệ. Vui lòng nhập lại.';
      return;
    }
  
    // Validate phone number
    if (!this.lecturer.PhoneNumber) {
      this.errorMessage = 'Số điện thoại không được để trống.';
      return;
    }
  
    if (this.lecturer.PhoneNumber.length !== 10 || isNaN(this.lecturer.PhoneNumber)) {
      this.errorMessage = 'Số điện thoại phải có đúng 10 chữ số.';
      return;
    }
  
    // Send update request to the server
    this.userService.updateUser(this.userId, {
      phone_number: this.lecturer.PhoneNumber, 
      email: this.lecturer.Email,
      ...this.lecturer
    }).subscribe(
      response => {
        alert('Cập nhật thông tin thành công');
        this.isEditing = false;
      },
      error => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
        }
      }
    );
  }

  // Cancel the editing process and restore original data
  cancelEditing() {
    this.isEditing = false;
    this.lecturer = { ...this.originalUser }; 
  }

  // Mở form đổi mật khẩu
  openChangePasswordForm() {
    this.isChangingPassword = true;
  }

  // Đóng form đổi mật khẩu
  cancelChangePassword() {
    this.isChangingPassword = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

    // Thay đổi mật khẩu
  changePassword() {
    this.errorMessage = '';

    // Kiểm tra tính hợp lệ của mật khẩu cũ
    if (!this.oldPassword) {
      this.errorMessage = 'Mật khẩu cũ không được để trống.';
      return;
    }

    // Kiểm tra tính hợp lệ của mật khẩu mới và xác nhận mật khẩu
    if (!this.newPassword) {
      this.errorMessage = 'Mật khẩu mới không được để trống.';
      return;
    }

    if (!this.confirmPassword) {
      this.errorMessage = 'Vui lòng nhập xác nhận mật khẩu mới.';
      return;
    }

    // Gọi API để thay đổi mật khẩu
    this.userService.changePassword(this.userId, this.oldPassword, this.newPassword, this.confirmPassword).subscribe(
      response => {
        alert('Đổi mật khẩu thành công');
        this.cancelChangePassword();
      },
      error => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
        }
      }
    );
  }
}
