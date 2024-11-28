import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';
import { StudentService } from '../../../service/student.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

  student: any = null;
  isEditing = false;
  userId: number = 0;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id; // Assuming user_id is in the stored user object

    // If user info exists, load the student info
    if (this.userId) {
      this.loadStudentInfo();
    }
  }

  // Call the service to load student data
  loadStudentInfo() {
    this.studentService.getStudentByUserId(this.userId).subscribe(
      (response: any) => {
        this.student = response;
      },
      (error) => {
        console.error('Error fetching student data:', error);
      }
    );
  }

  editStudentInfo() {
    this.isEditing = true;
  }
  saveStudentInfo() {
    this.studentService.updateStudentInfo(this.student.studentId, this.student).subscribe(
      () => {
        alert('Cập nhật thông tin thành công!');
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating student data:', error);
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadStudentInfo(); // Reload data to discard changes
  }
}
