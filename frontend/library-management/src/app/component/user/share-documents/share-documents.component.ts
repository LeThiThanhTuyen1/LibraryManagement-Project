import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-share-documents',
  templateUrl: './share-documents.component.html',
  styleUrl: './share-documents.component.css'
})
export class ShareDocumentsComponent {
  senderName: string = '';
  role: string = 'GiangVien';
  department: string = '';
  major: string = '';
  files: File[] = [];
  documents: Document[] = [];
  showShareForm: boolean = true; 
  constructor(private authService: AuthService, private http: HttpClient) {}
  ngOnInit(): void {
    this.getDocuments();  
  }
  onFileChange(event: any): void {
    this.files = event.target.files;
  }
  onSubmit(): void {
    const formData = new FormData();
    formData.append('senderName', this.senderName);
    formData.append('role', this.role);
    formData.append('department', this.department);
    formData.append('major', this.major);
    
    Array.from(this.files).forEach(file => {
      formData.append('files', file, file.name);
    });
    this.authService.uploadDocument(formData).subscribe(
      (response) => {
        alert('Tài liệu đã được gửi thành công!');
        // Làm mới các trường nhập liệu sau khi gửi thành công
        this.senderName = '';
        this.role = 'GiangVien';  // Giá trị mặc định của role
        this.department = '';
        this.major = '';
        // Reset lại input file
        const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';  // Xóa danh sách các file đã chọn
        }
        this.getDocuments();  // Refresh the document list
      },
      (error) => {
        alert('Lỗi khi upload tài liệu');
      }
    );
  }
  getDocuments(): void {
    // this.authService.getDocuments().subscribe(
    //   (data: Document[]) => {
    //     this.documents = data;
    //   },
    //   (error) => {
    //     console.error('Lỗi khi tải tài liệu', error);
    //   }
    // );
  }
  
  showDocumentList(): void {
    this.showShareForm = false;  // Chuyển sang hiển thị form tài liệu đã gửi
  }
}
