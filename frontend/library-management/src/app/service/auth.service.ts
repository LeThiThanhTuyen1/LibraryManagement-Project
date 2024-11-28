import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../model/user.model';
import { Document } from '../model/document.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5283/api/Users';

  constructor(private http: HttpClient) { }

  // Login method with error handling
  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password_hash: password });
    
  }

  // Get user information by user_id with error handling
  getUserInformation(user_id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${user_id}`);
  }

  // Update user information
  updateUserInformation(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.user_id}`, user);
  }
  
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, verificationCode: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      email,
      verificationCode,
      newPassword
    });
  }

  // AuthService
  changePassword(userId: number, oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password/${userId}`, {
      OldPassword: oldPassword,
      NewPassword: newPassword,
      ConfirmPassword: confirmPassword
    });
  }

  // Upload document with files
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload-document`, formData);
  }

  // Get list of uploaded documents
  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`);
  }
  

  

  
}

