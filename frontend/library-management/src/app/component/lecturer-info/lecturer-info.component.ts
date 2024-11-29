import { Component, OnInit } from '@angular/core';
import { LecturerService } from '../../service/lecturer.sevice';
import { Lecturer } from '../../model/lecturer.model';
import { HttpErrorResponse } from '@angular/common/http';  // Import HttpErrorResponse nếu cần

@Component({
  selector: 'app-lecturer-info',
  templateUrl: './lecturer-info.component.html',
  styleUrls: ['./lecturer-info.component.css']
})
export class LecturerInfoComponent implements OnInit {
  lecturer: Lecturer = {
    lecturer_id: 0,  // Default or null value
    user_id: 0,
    major_id: 0,
    position: '',
    start_year: 0,
  };  // Initialize lecturer to avoid null or undefined issues
  isEditing = false;

  constructor(private lecturerService: LecturerService) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser?.user_id;

    if (userId) {
      this.getLecturerInfo(userId);
    } else {
      console.error('Không tìm thấy user_id trong localStorage.');
    }
  }

  getLecturerInfo(userId: number): void {
    this.lecturerService.getLecturerByUserId(userId).subscribe({
      next: (lecturerData: Lecturer) => {
        this.lecturer = lecturerData; // Set lecturer data
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin giảng viên:', error);
      }
    });
  }

  editLecturer() {
    this.isEditing = true;
  }

  saveLecturerInfo() {
    this.isEditing = false;
    alert('Thông tin giảng viên đã được lưu!');
  }

  cancelEdit() {
    this.isEditing = false;
  }
}