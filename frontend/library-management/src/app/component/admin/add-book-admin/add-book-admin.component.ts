import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookAdminService } from '../../../service/bookadmin.service';
import { BookListComponent } from '../../book/book-list/book-list.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-book-admin',
  templateUrl: './add-book-admin.component.html',
  styleUrls: ['./add-book-admin.component.css'],
})
export class AddBookAdminComponent {
  addBookForm: FormGroup;
  selectedFile: File | null = null;
  isFileValid: boolean = false;

  constructor(private fb: FormBuilder, private bookAdminService: BookAdminService, private location: Location,) {

    this.addBookForm = this.fb.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      publicationYear: [
        '',
        [Validators.required, Validators.min(1000), Validators.max(3000)],
      ],
      language: [''],
      summary: [''],
      genre: [''],

      authorName: [''],
      authorNationality: [''],
      authorBirthYear: [null],

      publisherName: [''],
      publisherAddress: [''],
      publisherPhone: [''],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf', // PDF
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      ];
      const maxSizeInMB = 10; // Giới hạn kích thước file là 1MB
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      // Kiểm tra loại file
      if (!allowedTypes.includes(file.type)) {
        alert('File không hợp lệ. Vui lòng tải lên tài liệu hợp lệ (PDF, DOCX).');
        this.isFileValid = false; // Đánh dấu file không hợp lệ
        this.selectedFile = null; // Xóa file đã chọn
        return;
      }

      // Kiểm tra kích thước file
      if (file.size > maxSizeInBytes) {
        alert(`File quá lớn. Kích thước tối đa cho phép là ${maxSizeInMB} MB.`);
        this.isFileValid = false; // Đánh dấu file không hợp lệ
        this.selectedFile = null; // Xóa file đã chọn
        return;
      }

      // Nếu file hợp lệ
      this.selectedFile = file;
      this.isFileValid = true; // Đánh dấu file hợp lệ
    } else {
      // Không có file nào được chọn
      alert('Vui lòng chọn file!');
      this.isFileValid = false;
      this.selectedFile = null; // Xóa file đã chọn
    }
  }

  onSubmit() {
    if (this.addBookForm.invalid || !this.isFileValid) {
      alert('Vui lòng nhập đầy đủ thông tin hợp lệ và chọn file!');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.addBookForm.value.title);
    formData.append('isbn', this.addBookForm.value.isbn || 'Chưa có thông tin');
    formData.append('language', this.addBookForm.value.language || 'Chưa có thông tin');
    formData.append('publicationYear', this.addBookForm.value.publicationYear);
    formData.append('summary', this.addBookForm.value.summary || 'Chưa có thông tin');
    formData.append('genre', this.addBookForm.value.genre || 'Chưa có thông tin');
  
    // Thông tin tác giả
    formData.append('authorName', this.addBookForm.value.authorName || 'Chưa có thông tin');
    formData.append('authorNationality', this.addBookForm.value.authorNationality || 'Chưa có thông tin');
    formData.append('authorBirthYear', this.addBookForm.value.authorBirthYear ? this.addBookForm.value.authorBirthYear.toString() : 'Chưa có thông tin');
  
    // Thông tin nhà xuất bản
    formData.append('publisherName', this.addBookForm.value.publisherName || 'Chưa có thông tin');
    formData.append('publisherAddress', this.addBookForm.value.publisherAddress || 'Chưa có thông tin');
  
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    this.bookAdminService.addBook(formData).subscribe({
      next: (response) => {
        alert('Thêm sách thành công!');
        this.addBookForm.reset();
        this.selectedFile = null;
        this.isFileValid = false; // Reset trạng thái file
        BookListComponent.prototype.loadBooks();
      },
      error: (err) => {
        console.error('Lỗi khi thêm sách:', err);
        alert('Thêm sách thất bại, vui lòng thử lại!');
      },
    });
  }
  
  onCancel(): void {
    this.location.back();
  }
}
