import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css'],
})
export class ViewDocumentsComponent implements OnInit {
  documents: any[] = [];
  
  userId: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.user_id;
    this.authService.getDocumentsByUser(this.userId).subscribe({
      next: (data) => {
        this.documents = data;
      },
      error: (err) => {
        console.error('Error loading documents:', err);
      },
    });
  }
}
