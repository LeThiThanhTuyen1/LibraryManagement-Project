import { Component } from '@angular/core';
import { DocumentService } from '../../../service/document.service';
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
    user_id: 0,
    file_name: '',
    file_path: '',
    upload_date: new Date(),
    status: 'chờ duyệt',
    title: '',
    isbn: '',
    publication_year: 0,
    genre: '',
    summary: '',
    language: ''
  };
  selectedFile: File | null = null;
  UserId: string = '';
  uploadStatus: { success: boolean, message: string } | null = null;

  constructor(private documentService: DocumentService) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.UserId = user.user_id;
          console.log(this.UserId);
          const formData = new FormData();
          formData.append('user_id', this.UserId); // Thêm user_id
          formData.append('title', this.document.title);
          formData.append('publication_year', this.document.publication_year.toString());
          formData.append('genre', this.document.genre);
          formData.append('summary', this.document.summary);
          formData.append('language', this.document.language);
          formData.append('file', this.selectedFile, this.selectedFile.name);

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      this.documentService.uploadDocument(formData).subscribe({
        next: (response) => {
          console.log('Tài liệu đã được chia sẻ thành công!', response);
          this.uploadStatus = { success: true, message: 'Tài liệu đã được chia sẻ thành công!' };
          // Reset form
          this.document = {
            Id: 0,
            user_id: 0,
            file_name: '',
            file_path: '',
            upload_date: new Date(),
            status: 'chờ duyệt',
            title: '',
            isbn: '',
            publication_year: 0,
            genre: '',
            summary: '',
            language: ''
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