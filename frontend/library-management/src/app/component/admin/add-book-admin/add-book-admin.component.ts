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

  constructor(private fb: FormBuilder, private bookAdminService: BookAdminService) {
    this.addBookForm = this.fb.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      publisherName: [''],
      authorName: [''],
      publicationYear: [null, [Validators.min(1000), Validators.max(3000)]],
      language: [''],
      summary: [''],
      genre: [''],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf', 'application/docx', 'application/sql', 'application/msword', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert('File không hợp lệ.');
        return;
      }
      this.selectedFile = file;
    }
  }


  onSubmit() {
    if (this.addBookForm.invalid) {
      alert('Vui lòng nhập đầy đủ thông tin hợp lệ!');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.addBookForm.value.title);
    formData.append('isbn', this.addBookForm.value.isbn);
    if (this.addBookForm.value.publisherName) {
      formData.append('publisherName', this.addBookForm.value.publisherName);
    }
    if (this.addBookForm.value.authorName) {
      formData.append('authorName', this.addBookForm.value.authorName);
    }
    if (this.addBookForm.value.publicationYear) {
      formData.append('publicationYear', this.addBookForm.value.publicationYear);
    }
    if (this.addBookForm.value.language) {
      formData.append('language', this.addBookForm.value.language);
    }
    if (this.addBookForm.value.summary) {
      formData.append('summary', this.addBookForm.value.summary);
    }
    if (this.addBookForm.value.genre) {
      formData.append('genre', this.addBookForm.value.genre);
    }
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.bookAdminService.addBook(formData).subscribe({
      next: (response) => {
        alert('Thêm sách thành công!'); // Hiển thị thông báo thành công
        this.addBookForm.reset(); // Reset form sau khi thêm thành công
        BookListComponent.prototype.loadBooks(); // Gọi hàm loadBooks() từ `BookListComponent`
      },
      error: (err) => {
        console.error('Lỗi khi thêm sách:', err);
        alert('Thêm sách thất bại, vui lòng thử lại!');
      },
    });
  }
}
