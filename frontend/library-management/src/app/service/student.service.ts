import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:5283/api/Students'; // Adjust to your API URL

  constructor(private http: HttpClient) {}

  // Method to fetch student data by user ID
  getStudentByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/WithDetails/${userId}`);
  }

  // Method to update student information
  updateStudentInfo(studentId: number, student: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${studentId}`, student);
  }
}
