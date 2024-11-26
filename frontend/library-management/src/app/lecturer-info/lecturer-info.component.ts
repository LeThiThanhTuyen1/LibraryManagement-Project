import { Component } from '@angular/core';
import { Lecturer } from '../model/lecturer.model';

@Component({
  selector: 'app-lecturer-info',
  templateUrl: './lecturer-info.component.html',
  styleUrls: ['./lecturer-info.component.css']
})
export class LecturerInfoComponent {
  lecturer: Lecturer = {
    lecturer_id: 1,
    user_id: 1001,
    major_id: 2,
    position: 'Associate Professor',
    start_year: 2018
  };
  isEditing = false;

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
