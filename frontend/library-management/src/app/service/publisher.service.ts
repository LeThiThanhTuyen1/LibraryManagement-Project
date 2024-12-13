import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publisher } from '../model/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private apiUrl = 'http://localhost:5283/api/Publishers';

  constructor(private http: HttpClient) {}

  getAllPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(this.apiUrl);
  }
}
