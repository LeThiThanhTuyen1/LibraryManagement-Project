import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../service/student.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {
  student: any = {};  
  isEditing = false;

  userId: number = 0;
  originalUser: any;
  errorMessage: string = '';

  constructor(private studentService: StudentService, private userService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id;

    if (this.userId) {
      this.loadStudentInfo();  
    }
  }

  // Lấy thông tin sinh viên từ API
  loadStudentInfo() {
    this.studentService.getStudentByUserId(this.userId).subscribe(
      (response: any) => {
        this.student = response; 
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu sinh viên:', error);
      }
    );
  }  

  // Bật chế độ chỉnh sửa
  enableEditing() {
    this.isEditing = true;
    this.originalUser = { ...this.student };  
  }

  // Lưu thay đổi và kiểm tra dữ liệu
  saveChanges() {
    this.errorMessage = ''; 
  
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.student.Email)) {
      this.errorMessage = 'Email không hợp lệ. Vui lòng nhập lại.';
      return;
    }
  
    // Kiểm tra số điện thoại
    if (!this.student.PhoneNumber) {
      this.errorMessage = 'Số điện thoại không được để trống.';
      return;
    }
  
    if (this.student.PhoneNumber.length !== 10 || isNaN(this.student.PhoneNumber)) {
      this.errorMessage = 'Số điện thoại phải có đúng 10 chữ số.';
      return;
    }

    // Gửi yêu cầu cập nhật thông tin
    this.userService.updateUser(this.userId, {
      phone_number: this.student.PhoneNumber, 
      email: this.student.Email,
      ...this.student
    }).subscribe(
      response => {
        alert('Cập nhật thông tin thành công');
        this.isEditing = false;
        
        // Tải lại thông tin sinh viên sau khi cập nhật thành công
        this.loadStudentInfo();
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
    this.student = { ...this.originalUser };  
  }
}
