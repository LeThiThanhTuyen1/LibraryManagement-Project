import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {
  user: User | null = null;
  originalUser: User | null = null;
  isEditing: boolean = false;
  isChangingPassword: boolean = false;

  // Object to store password change form data
  passwordChange = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = 8; // Replace with logic for fetching the actual user ID
    this.getUserInfo(userId);
  }

  // Fetch user information
  getUserInfo(userId: number): void {
    this.authService.getUserInformation(userId).subscribe(
      (userData: User) => {
        this.user = { ...userData };
        this.originalUser = { ...userData };
      },
      (error) => {
        console.error('Error fetching user information:', error);
      }
    );
  }

  // Enable editing mode
  editUserInfo(): void {
    this.isEditing = true;
  }

  // Cancel editing and revert changes
  cancelEdit(): void {
    if (this.originalUser) {
      this.user = { ...this.originalUser };
    }
    this.isEditing = false;
  }

  // Save updated user information
  saveUserInfo(): void {
    if (this.user) {
      this.authService.updateUserInformation(this.user).subscribe(
        (updatedUser: User) => {
          this.user = updatedUser;
          this.isEditing = false;
          alert('Thông tin cá nhân đã được cập nhật thành công.');
        },
        (error) => {
          console.error('Error updating user information:', error);
          alert('Cập nhật thông tin thất bại.');
        }
      );
    }
  }

  // Enable password change mode
  editPassword(): void {
    this.isChangingPassword = true;
  }

  // Cancel password change
  cancelPasswordChange(): void {
    this.isChangingPassword = false;
    this.passwordChange = { oldPassword: '', newPassword: '', confirmPassword: '' };
  }

  // Handle password change form submission
  changePassword(): void {
    if (this.user) {
      const userId = this.user.user_id;
      const { oldPassword, newPassword, confirmPassword } = this.passwordChange;

      if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp.');
        return;
      }

      this.authService.changePassword(userId, oldPassword, newPassword, confirmPassword).subscribe(
        (response) => {
          alert('Đổi mật khẩu thành công.');
          this.isChangingPassword = false;
        },
        (error) => {
          console.error('Error changing password:', error);
          alert(error.error.message || 'Đổi mật khẩu thất bại.');
        }
      );
    }
  }
}
