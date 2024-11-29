import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5283/api/Students'; 

  constructor(private http: HttpClient) {}

  getStudentByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/WithDetailsByUserId/${userId}`);
  }  
  
}
