import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../model/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://localhost:5283/api/Favorites';

  constructor(private http: HttpClient) { }

  getFavoritesByUserId(userId: number): Observable<Favorite[]> {
    const url = `${this.apiUrl}/GetFavoritesByUser/${userId}`;
    return this.http.get<Favorite[]>(url);
  }
  
  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, favorite);
  }
  
  deleteFavoriteByBookId(bookId: number): Observable<void> {
    const url = `${this.apiUrl}/RemoveFavoriteByBookId/${bookId}`;
    return this.http.delete<void>(url);
  }

}
