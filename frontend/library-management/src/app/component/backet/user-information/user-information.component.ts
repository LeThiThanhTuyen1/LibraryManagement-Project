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
  originalUser: User | null = null;  // To store original data
  isEditing: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = 1; // Replace with logic for fetching the actual user ID
    this.getUserInfo(userId);
  }

  // Fetch user information
  getUserInfo(userId: number): void {
    this.authService.getUserInformation(userId).subscribe(
      (userData: User) => {
        this.user = { ...userData };  // Make a copy of the data
        this.originalUser = { ...userData };  // Store original data for reverting
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
  }

  // Enable editing mode
  editUserInfo(): void {
    this.isEditing = true;
  }

  // Cancel editing and revert to original data
  cancelEdit(): void {
    if (this.originalUser) {
      this.user = { ...this.originalUser };  // Revert to original data
    }
    this.isEditing = false;
  }

  // Save updated user information
  saveUserInfo(): void {
    if (this.user) {
      this.authService.updateUserInformation(this.user).subscribe(
        (updatedUser: User) => {
          this.user = updatedUser;  // Update the local user object with saved data
          this.isEditing = false;  // Exit editing mode
        },
        error => {
          console.error('Error updating user information:', error);
        }
      );
    }
  }

  // Handle password change
  editPassword(): void {
    console.log('Edit Password button clicked');
  }
}
