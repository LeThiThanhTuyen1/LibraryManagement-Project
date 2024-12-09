import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { Location } from '@angular/common';
import { FavoriteService } from '../../../service/favorite.service';
import { Favorite } from '../../../model/favorite.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  bookId!: number;
  isLoading = true;
  isFavorite: boolean = false;
  favorites: Favorite[] = [];
  documentUrl!: SafeResourceUrl;
  
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private favoriteService: FavoriteService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookId = params['id'];
      this.loadBookDetails(this.bookId);
    });
  }

  checkFavoriteStatus() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.user_id;
  
      const favoriteBooksData = JSON.parse(localStorage.getItem('favoriteBooks') || '{}');
      const favoriteBooks = favoriteBooksData[userId] || [];
  
      // Kiểm tra xem sách hiện tại có nằm trong danh sách yêu thích không
      if (this.book) {
        this.isFavorite = favoriteBooks.some((f: Favorite) => f.book_id === this.book.book_id);
      }
    }
  }   

  toggleFavorite() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.user_id;
  
      // Lấy danh sách yêu thích từ localStorage (nếu có)
      let favoriteBooksData = JSON.parse(localStorage.getItem('favoriteBooks') || '{}');
      let favoriteBooks = favoriteBooksData[userId] || [];
  
      // Kiểm tra trạng thái yêu thích trước khi thêm hoặc xóa
      if (this.isFavorite) {
        // Nếu sách đã có trong danh sách yêu thích, thực hiện xóa
        const favoriteItem = favoriteBooks.find((f: Favorite) => f.book_id === this.book.book_id);
  
        if (favoriteItem) {
          this.favoriteService.deleteFavoriteByBookId(favoriteItem.book_id).subscribe({
            next: () => {
              console.log('Đã xóa khỏi danh sách yêu thích');
              this.favorites = this.favorites.filter(f => f.book_id !== favoriteItem.book_id);
            },
            error: (err) => {
              console.error('Lỗi khi xóa khỏi danh sách yêu thích:', err);
            }
          });
  
          // Xóa sách khỏi danh sách yêu thích trong localStorage
          favoriteBooks = favoriteBooks.filter((f: Favorite) => f.book_id !== this.book.book_id);
          this.isFavorite = false;
        }
  
      } else {
        // Nếu sách chưa có trong danh sách yêu thích, thực hiện thêm
        if (!favoriteBooks.some((f: Favorite) => f.book_id === this.book.book_id)) {
          const newFavorite: Favorite = {
            favorite_id: 0, // giả sử API sẽ tự tạo ID mới
            book_id: this.book.book_id,
            user_id: userId,
            added_date: new Date(),
            title: this.book.title,
            name: this.book.AuthorName
          };
  
          this.favoriteService.addFavorite(newFavorite).subscribe({
            next: (data) => {
              console.log('Đã thêm vào danh sách yêu thích', data);
              this.favorites.push(data);
            },
            error: (err) => {
              console.error('Lỗi khi thêm vào danh sách yêu thích:', err);
              console.error('Thông tin lỗi chi tiết:', err.error);  // In chi tiết thông báo lỗi từ server
            }
          });
          
  
          favoriteBooks.push(newFavorite);
          this.isFavorite = true;
        } else {
          console.log('Sách này đã tồn tại trong danh sách yêu thích');
        }
      }
  
      // Cập nhật lại danh sách yêu thích vào localStorage
      favoriteBooksData[userId] = favoriteBooks;
      localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooksData));
    }
  }  

  loadBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((data: Book) => {
      this.book = data;
      console.log('Chi tiết sách:', this.book); // Debug kiểm tra
      this.isLoading = false;
  
      // Kiểm tra trạng thái yêu thích sau khi đã có thông tin sách
      this.checkFavoriteStatus();
    });
  }   

  goBack(): void {
    this.location.back();
  }

  get locationService() {
    return this.location;
  }  

  viewDocument(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && this.book) {
      const user = JSON.parse(storedUser);
      const userRole = user.role; // Lấy role của người dùng từ localStorage
  
      console.log('User Role:', userRole);
      console.log('Book Access Level:', this.book.accessLevel);
  
      // Kiểm tra quyền truy cập
      if (this.book.accessLevel === 'public' || userRole === 'admin' || this.book.accessLevel === userRole) {
        // Cho phép xem tài liệu
        this.bookService.getBookFile(this.book.book_id).subscribe(
          (response: Blob) => {
            const mimeType = response.type; // MIME type của file
            const fileURL = URL.createObjectURL(response);
            
            // Kiểm tra loại file để hiển thị
            if (mimeType === 'application/pdf') {
              this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            } else if (
              mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
              mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
              // Dùng Google Docs Viewer để mở các file Office
              const googleViewerUrl = `https://docs.google.com/viewer?url=${fileURL}&embedded=true`;
              this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
            } else {
              alert('Loại tài liệu không được hỗ trợ để xem trực tiếp.');
            }
          },
          (error) => {
            console.error('Lỗi khi tải tài liệu:', error);
          }
        );
      } else {
        // Hiển thị thông báo lỗi nếu không có quyền
        alert('Bạn không có quyền truy cập tài liệu này.');
      }
    } else {
      console.error('Thông tin người dùng hoặc sách không khả dụng.');
    }
  }
  
  closeDocumentViewer(): void {
    this.documentUrl = ''; 
  }

  downloadDocument(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && this.book) {
      const user = JSON.parse(storedUser);
      const userRole = user.role; // Lấy role của người dùng từ localStorage
  
      console.log('User Role:', userRole);
      console.log('Book Access Level:', this.book.accessLevel);
  
      // Kiểm tra quyền truy cập
      if (this.book.accessLevel === 'public' || userRole === 'admin' || this.book.accessLevel === userRole) {
        // Gọi API để tải file
        this.bookService.getBookFile(this.book.book_id).subscribe(
          (response: Blob) => {
            const fileName = this.book.title + this.getFileExtension(response.type);
            const fileURL = URL.createObjectURL(response);
  
            // Tạo một thẻ <a> để kích hoạt tải xuống
            const anchor = document.createElement('a');
            anchor.href = fileURL;
            anchor.download = fileName;
            anchor.click();
  
            // Thu hồi URL sau khi tải
            URL.revokeObjectURL(fileURL);
  
            // Hiển thị thông báo tải thành công
            alert('Tải tài liệu thành công!');
          },
          (error) => {
            console.error('Lỗi khi tải tài liệu:', error);
            alert('Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.');
          }
        );
      } else {
        // Hiển thị thông báo nếu không có quyền truy cập
        alert('Bạn không có quyền tải tài liệu này.');
      }
    } else {
      console.error('Thông tin người dùng hoặc sách không khả dụng.');
      alert('Vui lòng đăng nhập để tải tài liệu.');
    }
  }
  
  // Hàm hỗ trợ để lấy phần mở rộng file từ MIME type
  private getFileExtension(mimeType: string): string {
    const mimeExtensions: { [key: string]: string } = {
      'application/pdf': '.pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    };
    return mimeExtensions[mimeType] || '';
  }
  
}
