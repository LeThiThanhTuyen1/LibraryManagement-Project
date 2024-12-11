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
  user: any = {}; 
  isEditing = false;
  userId: number = 0;
  originalUser: any;
  errorMessage: string = '';

  constructor(private lecturerService: LecturerService, private userService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id;
    this.user.Email = user.email;
    this.user.PhoneNumber = user.phone_number || '';

    if (this.userId) {
      this.loadLecturerInfo();
    }
  }

  loadLecturerInfo() {
    this.lecturerService.getLecturerDetailsByUserId(this.userId).subscribe(
      (response: any) => {
        this.lecturer = response;
        console.log(this.lecturer);
      },
      (error) => {
        console.error('Error fetching lecturer data:', error);
      }
    );
  }

  enableEditing() {
    this.isEditing = true;
    this.originalUser = { ...this.user }; // Lưu lại thông tin gốc của user
  }

  saveChanges() {
    this.errorMessage = ''; // Reset thông báo lỗi
  
    // Kiểm tra email ở frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.Email)) {
      this.errorMessage = 'Email không hợp lệ. Vui lòng nhập lại.';
      return;
    }
  
    // Kiểm tra số điện thoại trống
    if (!this.user.PhoneNumber) {
      this.errorMessage = 'Số điện thoại không được để trống.';
      return;
    }
  
    // Kiểm tra số điện thoại
    if (this.user.PhoneNumber.length !== 10 || isNaN(this.user.PhoneNumber)) {
      this.errorMessage = 'Số điện thoại phải có đúng 10 chữ số.';
      return;
    }
  
    // Gửi yêu cầu cập nhật lên server
    this.userService.updateUser(this.userId, this.user).subscribe(
      response => {
        console.log('User updated successfully', response);
        alert('Cập nhật thông tin thành công');
        this.isEditing = false;
      },
      error => {
        // Hiển thị thông báo lỗi từ backend
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
        }
      }
    );
  }  

  cancelEditing() {
    this.isEditing = false;
    this.user = { ...this.originalUser };
  }
}