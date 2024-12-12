import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../service/book.service';
import { PublisherService } from '../../../service/publisher.service';
import { Book } from '../../../model/book.model';
import { Publisher } from '../../../model/publisher.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css'] // Đảm bảo sử dụng đúng "styleUrls"
})
export class BookEditComponent implements OnInit {
  bookForm!: FormGroup;
  publishers: Publisher[] = [];
  bookId!: number;
  originalBookData: any; // Lưu trữ dữ liệu ban đầu của sách

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Lấy ID sách từ URL
    this.bookId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();

    // Kiểm tra người dùng từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);

      // Nếu không phải là admin, chuyển hướng về trang danh sách sách
      if (user.role !== 'admin') {
        alert('You are not authorized to access this page. Redirecting to the book list.');
        this.router.navigate(['/book-list']);
        return;
      }
    } else {
      // Nếu không tìm thấy thông tin người dùng trong localStorage, chuyển hướng về trang danh sách sách
      this.router.navigate(['/book-list']);
      return;
    }

    // Lấy danh sách nhà xuất bản
    this.publisherService.getAllPublishers().subscribe((publishers) => {
      this.publishers = publishers;
    });

    // Lấy thông tin sách và cập nhật form
    this.bookService.getBookById(this.bookId).subscribe((book) => {
      this.originalBookData = { ...book }; // Lưu trữ dữ liệu ban đầu
      this.bookForm.patchValue({
        title: book.title,
        isbn: book.isbn,
        publication_year: book.publication_year,
        genre: book.genre,
        summary: book.summary,
        language: book.language,
        PublisherId: this.publishers.find(p => p.name === book.PublisherName)?.publisher_id || null
      });
    });
  }

  private initForm(): void {
    // Khởi tạo form với các trường dữ liệu
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      publication_year: [null, Validators.required],
      genre: [''],
      summary: [''],
      language: [''],
      PublisherId: [null, Validators.required] // ID nhà xuất bản
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formData = this.bookForm.value;
      
      // Cập nhật chỉ các trường thay đổi
      const updatedData = {
        book_id: this.bookId,  // Sử dụng bookId thay vì id
        title: formData.title || this.originalBookData.title,
        isbn: formData.isbn || this.originalBookData.isbn,
        publication_year: formData.publication_year || this.originalBookData.publication_year,
        genre: formData.genre || this.originalBookData.genre,
        summary: formData.summary || this.originalBookData.summary,
        publisherId: formData.PublisherId || this.originalBookData.PublisherId,  // ID của nhà xuất bản
        language: formData.language || this.originalBookData.language,
        file_path: this.originalBookData.file_path || '',  // Giữ nguyên giá trị file_path
        publisher: {
          publisher_id: formData.PublisherId || this.originalBookData.PublisherId,  // ID nhà xuất bản
          name: this.publishers.find(p => p.publisher_id === (formData.PublisherId || this.originalBookData.PublisherId))?.name || this.originalBookData.publisher?.name || '',
          address: this.originalBookData.publisher?.address || '' // Kiểm tra sự tồn tại của publisher trước khi truy cập address
        },
        accessLevel: this.originalBookData.accessLevel || ''  // Giữ nguyên giá trị accessLevel nếu không thay đổi
      };
  
      console.log('Data to update:', updatedData); // Log dữ liệu để kiểm tra
  
      this.bookService.updateBook(this.bookId, updatedData).subscribe({
        next: (response) => {
          console.log('Update successful', response);
  
          // Hiển thị thông báo thành công
          alert('Cập nhật sách thành công!');
  
          // Sau khi thông báo thành công, chuyển hướng về trang book-list
          this.router.navigate(['/book-list']);
        },
        error: (err) => {
          console.error('Error updating book', err);
          alert('Cập nhật sách thất bại. Vui lòng thử lại!');
        }
      });
    } else {
      console.error('Form is invalid', this.bookForm.errors);
      alert('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
    }
  }
  
  goBack(): void {
    this.router.navigate(['/book-list']);  // Điều hướng về trang danh sách sách
  }
  
}
