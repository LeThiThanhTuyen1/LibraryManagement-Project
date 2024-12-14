import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { Location } from '@angular/common';
import { FavoriteService } from '../../../service/favorite.service';
import { Favorite } from '../../../model/favorite.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as mammoth from 'mammoth';

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
  tempFileUrl: string = '';
  
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

  private handleDocxFile(blob: Blob, fallbackUrl: string): void {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        // Tạo HTML content với styling
        const htmlContent = `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  margin: 15px 0;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
              </style>
            </head>
            <body>${result.value}</body>
          </html>
        `;

        // Tạo Blob từ HTML content
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(htmlBlob)
        );

      } catch (error) {
        console.error('Error converting DOCX:', error);
        this.handleFallback(fallbackUrl);
      }
    };
    reader.readAsArrayBuffer(blob);
  }

  private handleFallback(fileUrl: string): void {
    const downloadChoice = confirm(
      'Không thể xem trực tiếp file này. Bạn có muốn tải xuống không?'
    );
    if (downloadChoice) {
      const anchor = document.createElement('a');
      anchor.href = fileUrl;
      anchor.download = this.book.title || 'document';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
    // Cleanup
    URL.revokeObjectURL(fileUrl);
  }

  viewDocument(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && this.book) {
      const user = JSON.parse(storedUser);
      const userRole = user.role;

      if (this.book.accessLevel === 'public' || userRole === 'admin' || this.book.accessLevel === userRole) {
        this.bookService.viewDocument(this.book.book_id).subscribe(
          (response: Blob) => {
            const mimeType = response.type;
            const fileURL = URL.createObjectURL(response);
            
            switch(mimeType) {
              case 'application/pdf':
                this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                break;

              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                this.handleDocxFile(response, fileURL);
                break;

              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                try {
                  const apiUrl = `${window.location.origin}/api/Books/ViewDocument/${this.book.book_id}`;
                  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(apiUrl)}&embedded=true`;
                  this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleDocsUrl);

                  setTimeout(() => {
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                      if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                        this.handleFallback(fileURL);
                      }
                    }
                  }, 3000);

                } catch (error) {
                  console.error('Error viewing document:', error);
                  this.handleFallback(fileURL);
                }
                break;

              case 'image/jpeg':
              case 'image/png':
                this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                break;

              case 'text/plain':
                const reader = new FileReader();
                reader.onload = (e) => {
                  const textContent = e.target?.result;
                  const htmlContent = `
                    <html>
                      <head>
                        <style>
                          body {
                            font-family: monospace;
                            white-space: pre-wrap;
                            padding: 20px;
                            line-height: 1.5;
                          }
                        </style>
                      </head>
                      <body>${textContent}</body>
                    </html>
                  `;
                  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
                  this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                    URL.createObjectURL(htmlBlob)
                  );
                };
                reader.readAsText(response);
                break;

              default:
                this.handleFallback(fileURL);
                break;
            }
          },
          (error) => {
            console.error('Lỗi khi tải tài liệu:', error);
            alert('Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.');
          }
        );
      } else {
        alert('Bạn không có quyền truy cập tài liệu này.');
      }
    } else {
      alert('Vui lòng đăng nhập để xem tài liệu.');
    }
  }

  closeDocumentViewer(): void {
    this.documentUrl = '';
    if (this.tempFileUrl) {
      URL.revokeObjectURL(this.tempFileUrl);
      this.tempFileUrl = '';
    }
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
