import { Component } from '@angular/core';
import { StudentService } from '../../../service/student.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent {
  student: any = null;
  isEditing = false;
  isChangingPassword = false; // New flag for changing password
  userId: number = 0;
  newPassword: string = ''; // To store the new password

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id; 
        
    if (this.userId) {
      this.loadStudentInfo();
    }
  }

  loadStudentInfo() {
    this.studentService.getStudentByUserId(this.userId).subscribe(
      (response: any) => {
        this.student = response;
        console.log(this.student);
      },
      (error) => {
        console.error('Error fetching student data:', error);
      }
    );
  }

}
