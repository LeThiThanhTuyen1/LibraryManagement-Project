import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lecturer } from '../model/lecturer.model';

@Injectable({
  providedIn: 'root'
})
export class LecturerService {
  private apiUrl = 'http://localhost:5283/api/Lecturers';  
  
    constructor(private http: HttpClient) { }
  
    getLecturerDetailsByUserId(userId: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/WithDetailsByUserId/${userId}`);
    }
}
