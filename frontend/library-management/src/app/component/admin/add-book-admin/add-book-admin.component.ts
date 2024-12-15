import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookAdminService } from '../../../service/bookadmin.service';
import { BookListComponent } from '../../book/book-list/book-list.component';

@Component({
  selector: 'app-add-book-admin',
  templateUrl: './add-book-admin.component.html',
  styleUrls: ['./add-book-admin.component.css'],
})
export class AddBookAdminComponent {
  addBookForm: FormGroup;
  selectedFile: File | null = null;
  isFileValid: boolean = false;

  constructor(private fb: FormBuilder, private bookAdminService: BookAdminService) {
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
        'application/pdf',
        'application/doc',
        'application/sql',
        'application/msword',
        'text/plain',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('File không hợp lệ.');
        this.isFileValid = false; // Đánh dấu file không hợp lệ
        return;
      }
      this.selectedFile = file;
      this.isFileValid = true; // Đánh dấu file hợp lệ
    } else {
      this.isFileValid = false; // Không có file nào được chọn
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

    formData.append('authorName', this.addBookForm.value.authorName || 'Chưa có thông tin');
    formData.append('authorNationality', this.addBookForm.value.authorNationality || 'Chưa có thông tin');
    formData.append('authorBirthYear', this.addBookForm.value.authorBirthYear ? this.addBookForm.value.authorBirthYear.toString() : 'Chưa có thông tin');
    formData.append('publisherName', this.addBookForm.value.publisherName || 'Chưa có thông tin');
    formData.append('publisherAddress', this.addBookForm.value.publisherAddress || 'Chưa có thông tin');
    formData.append('publisherPhone', this.addBookForm.value.publisherPhone || 'Chưa có thông tin');

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
}
