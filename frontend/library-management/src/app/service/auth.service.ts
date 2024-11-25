import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5283/api/Users';

  constructor(private http: HttpClient) { }

  // Login method with error handling
  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password_hash: password });
    
  }

  // Get user information by user_id with error handling
  getUserInformation(user_id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${user_id}`);
  }

  // Update user information
  updateUserInformation(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.user_id}`, user);
  }
}