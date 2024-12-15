import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../service/student.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {
  student: any = {};  // Dữ liệu sinh viên lấy từ API
  user: any = {};     // Dữ liệu người dùng (email, số điện thoại, v.v.)
  isEditing = false;

  userId: number = 0;
  originalUser: any;
  errorMessage: string = '';

  constructor(private studentService: StudentService, private userService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id;
    this.user.Email = user.email;      // Gán email người dùng
    this.user.PhoneNumber = user.phone_number || '';  // Gán số điện thoại người dùng

    if (this.userId) {
      this.loadStudentInfo();  // Lấy thông tin sinh viên từ API
    }
  }

  // Lấy thông tin sinh viên từ API
  loadStudentInfo() {
    this.studentService.getStudentByUserId(this.userId).subscribe(
      (response: any) => {
        this.student = response;  // Lưu thông tin sinh viên
        this.user.PhoneNumber = this.student.phoneNumber || '';  // Gán số điện thoại từ sinh viên vào user
        console.log(this.student);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu sinh viên:', error);
      }
    );
  }

  // Bật chế độ chỉnh sửa
  enableEditing() {
    this.isEditing = true;
    this.originalUser = { ...this.user };  // Lưu dữ liệu gốc để hủy chỉnh sửa
  }

  // Lưu thay đổi và kiểm tra dữ liệu
  saveChanges() {
    this.errorMessage = ''; // Reset thông báo lỗi

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.Email)) {
      this.errorMessage = 'Email không hợp lệ. Vui lòng nhập lại.';
      return;
    }

    // Kiểm tra số điện thoại
    if (!this.user.PhoneNumber) {
      this.errorMessage = 'Số điện thoại không được để trống.';
      return;
    }

    if (this.user.PhoneNumber.length !== 10 || isNaN(this.user.PhoneNumber)) {
      this.errorMessage = 'Số điện thoại phải có đúng 10 chữ số.';
      return;
    }

    // Gửi yêu cầu cập nhật thông tin
    this.userService.updateUser(this.userId, this.user).subscribe(
      response => {
        console.log('Cập nhật người dùng thành công', response);
        alert('Cập nhật thông tin thành công');
        this.isEditing = false;  // Tắt chế độ chỉnh sửa
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

  // Hủy chỉnh sửa và phục hồi dữ liệu ban đầu
  cancelEditing() {
    this.isEditing = false;
    this.user = { ...this.originalUser };  // Phục hồi dữ liệu gốc
  }
}
