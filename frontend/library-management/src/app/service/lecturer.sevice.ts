import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lecturer } from '../model/lecturer.model'; // Đảm bảo bạn đã tạo đúng model

@Injectable({
  providedIn: 'root'
})
export class LecturerService {

    private apiUrl = 'http://localhost:5283/api/Lecturers';  // Kiểm tra API endpoint
  
    constructor(private http: HttpClient) { }
  
    getLecturerByUserId(userId: number): Observable<Lecturer> {
      const url = `${this.apiUrl}/GetLecturerByUser/${userId}`;  // Kiểm tra URL API
      return this.http.get<Lecturer>(url);
    }
  
    // Cập nhật thông tin giảng viên
    updateLecturerInfo(lecturer: Lecturer): Observable<Lecturer> {
        return this.http.put<Lecturer>(`${this.apiUrl}/lecturers/${lecturer.lecturer_id}`, lecturer);
    }
}
