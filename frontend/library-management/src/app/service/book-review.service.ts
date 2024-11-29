import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookReview } from '../model/book-review.model';

@Injectable({
  providedIn: 'root',
})
export class BookReviewService {
  private apiUrl = 'http://localhost:5283/api/BookReviews';

  constructor(private http: HttpClient) {}

  getReviewsByBookId(bookId: number): Observable<BookReview[]> {
    return this.http
      .get<BookReview[]>(`${this.apiUrl}/book_id/${bookId}`)
      .pipe(catchError(this.handleError));
  }

  addReview(review: BookReview): Observable<BookReview> {
    return this.http
      .post<BookReview>(this.apiUrl, review)
      .pipe(catchError(this.handleError));
  }
  
  checkUserReviewed(bookId: number, userId: number): Observable<BookReview | null> {
    return this.http
      .get<BookReview | null>(`${this.apiUrl}/user_reviewed/${bookId}/${userId}`)
      .pipe(
        catchError((err) => {
          if (err.status === 404) return of(null); // Nếu chưa đánh giá
          return throwError(() => new Error('Error checking review status.'));
        })
      );
  }
  deleteReview(bookId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${bookId}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }
  updateReview(review: Partial<BookReview>): Observable<BookReview> {
    return this.http
      .put<BookReview>(`${this.apiUrl}/${review.review_id}`, review)
      .pipe(catchError(this.handleError));
  }
  
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error.message);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
