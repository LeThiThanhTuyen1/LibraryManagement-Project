import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../model/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:5283/api/Reviews';

  constructor(private http: HttpClient) { }

  getReviewsByBookId(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/book/${bookId}`);
  }

  addReview(review: Review): Observable<any> {
    return this.http.post(this.apiUrl, review);
  }

  hasUserReviewed(bookId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${bookId}/${userId}`);
  }
} 