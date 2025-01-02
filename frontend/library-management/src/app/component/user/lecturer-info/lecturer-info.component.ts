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
}
