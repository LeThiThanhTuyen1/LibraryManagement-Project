import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Document } from '../../../model/document.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-share-documents',
  templateUrl: './share-documents.component.html',
  styleUrls: ['./share-documents.component.css']
})
export class ShareDocumentsComponent {
  document: Document = {
    Id: 0,
    FileName: '',
    FilePath: '',
    UploadDate: new Date(),
    Status: 'chờ duyệt',
    Title: '',
    Isbn: '',
    Publication_year: 0,
    Genre: '',
    Summary: '',
    Language: ''
  };
  selectedFile: File | null = null;
  uploadStatus: { success: boolean, message: string } | null = null;

  constructor(private authService: AuthService) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.document.Title);
      formData.append('publication_year', this.document.Publication_year.toString());
      formData.append('genre', this.document.Genre);
      formData.append('summary', this.document.Summary);
      formData.append('language', this.document.Language);
      formData.append('file', this.selectedFile, this.selectedFile.name);
  
      this.authService.uploadDocument(formData).subscribe({
        next: (response) => {
          console.log('Tài liệu đã được chia sẻ thành công!', response);
          this.uploadStatus = { success: true, message: 'Tài liệu đã được chia sẻ thành công!' };
          // Reset form
          this.document = {
            Id: 0,
            FileName: '',
            FilePath: '',
            UploadDate: new Date(),
            Status: 'chờ duyệt',
            Title: '',
            Isbn: '',
            Publication_year: 0,
            Genre: '',
            Summary: '',
            Language: ''
          };
          this.selectedFile = null;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Lỗi khi chia sẻ tài liệu:', error.message);
          this.uploadStatus = { success: false, message: 'Lỗi khi chia sẻ tài liệu. Vui lòng thử lại.' };
        }
      });
    }
  }
  
  
}
