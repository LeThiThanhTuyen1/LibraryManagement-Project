import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../model/book.model';
import { Location } from '@angular/common';
import { FavoriteService } from '../../../service/favorite.service';
import { Favorite } from '../../../model/favorite.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as mammoth from 'mammoth';

interface MammothOptions {
  arrayBuffer: ArrayBuffer;
  convertImage?: any;
  includeDefaultStyleMap?: boolean;
  styleMap?: string[];
}

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit, OnChanges {
  @Input() bookId!: number;
  @Input() hideReviewButton: boolean = false;
  showReviewSection: boolean = false;
  book!: Book;
  isLoading = true;
  isFavorite: boolean = false;
  favorites: Favorite[] = [];
  documentUrl!: SafeResourceUrl;
  tempFileUrl: string = '';
  showDialog: boolean = false;
  dialogMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private favoriteService: FavoriteService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.bookId) {
      this.loadBookDetails(this.bookId);
    } else {
      this.route.params.subscribe((params) => {
        const id = params['id'];
        if (id) {
          this.bookId = +id;
          this.loadBookDetails(this.bookId);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookId'] && changes['bookId'].currentValue) {
      this.loadBookDetails(changes['bookId'].currentValue);
    }
  }

  checkFavoriteStatus() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.user_id;

      const favoriteBooksData = JSON.parse(
        localStorage.getItem('favoriteBooks') || '{}'
      );
      const favoriteBooks = favoriteBooksData[userId] || [];

      // Kiểm tra xem sách hiện tại có nằm trong danh sách yêu thích không
      if (this.book) {
        this.isFavorite = favoriteBooks.some(
          (f: Favorite) => f.book_id === this.book.book_id
        );
      }
    }
  }

  toggleFavorite() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.user_id;

      // Lấy danh sách yêu thích từ localStorage (nếu có)
      let favoriteBooksData = JSON.parse(
        localStorage.getItem('favoriteBooks') || '{}'
      );
      let favoriteBooks = favoriteBooksData[userId] || [];

      // Kiểm tra trạng thái yêu thích trước khi thêm hoặc xóa
      if (this.isFavorite) {
        // Nếu sách đã có trong danh sách yêu thích, thực hiện xóa
        const favoriteItem = favoriteBooks.find(
          (f: Favorite) => f.book_id === this.book.book_id
        );

        if (favoriteItem) {
          this.favoriteService
            .deleteFavoriteByBookId(favoriteItem.book_id)
            .subscribe({
              next: () => {
                console.log('Đã xóa khỏi danh sách yêu thích');
                this.favorites = this.favorites.filter(
                  (f) => f.book_id !== favoriteItem.book_id
                );
              },
              error: (err) => {
                console.error('Lỗi khi xóa khỏi danh sách yêu thích:', err);
              },
            });

          // Xóa sách khỏi danh sách yêu thích trong localStorage
          favoriteBooks = favoriteBooks.filter(
            (f: Favorite) => f.book_id !== this.book.book_id
          );
          this.isFavorite = false;
        }
      } else {
        // Nếu sách chưa có trong danh sách yêu thích, thực hiện thêm
        if (
          !favoriteBooks.some((f: Favorite) => f.book_id === this.book.book_id)
        ) {
          const newFavorite: Favorite = {
            favorite_id: 0, // giả sử API sẽ tự tạo ID mới
            book_id: this.book.book_id,
            user_id: userId,
            added_date: new Date(),
            title: this.book.title,
            name: this.book.AuthorName,
          };

          this.favoriteService.addFavorite(newFavorite).subscribe({
            next: (data) => {
              console.log('Đã thêm vào danh sách yêu thích', data);
              this.favorites.push(data);
            },
            error: (err) => {
              console.error('Lỗi khi thêm vào danh sách yêu thích:', err);
              console.error('Thông tin lỗi chi tiết:', err.error); // In chi tiết thông báo lỗi từ server
            },
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
    this.isLoading = true;
    this.bookService.getBookById(id).subscribe({
      next: (data: Book) => {
        this.book = data;
        this.isLoading = false;
        this.checkFavoriteStatus();
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.isLoading = false;
      },
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
        const options: MammothOptions = {
          arrayBuffer: arrayBuffer,
          styleMap: [
            "p[style-name='Title'] => h1:fresh",
            "p[style-name='Heading 1'] => h2:fresh",
            "p[style-name='Heading 2'] => h3:fresh",
            "table => table",
            "tr => tr",
            "td => td"
          ]
        };

        const result = await mammoth.convertToHtml(options);

        // Tạo HTML content với styling cập nhật
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
                /* Style cho bảng */
                table {
                  border-collapse: collapse;
                  width: 100%;
                  margin: 15px 0;
                  table-layout: fixed;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                  word-wrap: break-word;
                  min-width: 100px;
                }
                th {
                  background-color: #f2f2f2;
                  font-weight: bold;
                }
                tr:nth-child(even) {
                  background-color: #f9f9f9;
                }
                tr:hover {
                  background-color: #f5f5f5;
                }
                /* Style cho tiêu đề */
                h1 {
                  color: #2c3e50;
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                h2 {
                  color: #34495e;
                  font-size: 20px;
                  margin: 15px 0;
                }
                h3 {
                  color: #7f8c8d;
                  font-size: 18px;
                  margin: 10px 0;
                }
                /* Style cho danh sách */
                ul, ol {
                  margin: 10px 0;
                  padding-left: 20px;
                }
                li {
                  margin: 5px 0;
                }
              </style>
            </head>
            <body>${result.value}</body>
          </html>
        `;

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
    this.showDialog = true;
    this.dialogMessage = 'Định dạng file không được hỗ trợ. Chỉ hỗ trợ xem file PDF và DOCX.';
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

            switch (mimeType) {
              case 'application/pdf':
                this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                break;

              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                this.handleDocxFile(response, fileURL);
                break;

              default:
                this.handleFallback(fileURL);
                break;
            }
          },
          (error) => {
            console.error('Lỗi khi tải tài liệu:', error);
            this.showDialog = true;
            this.dialogMessage = 'Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.';
          }
        );
      } else {
        this.showDialog = true;
        this.dialogMessage = 'Bạn không có quyền truy cập tài liệu này.';
      }
    } else {
      this.showDialog = true;
      this.dialogMessage = 'Vui lòng đăng nhập để xem tài liệu.';
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
      const userRole = user.role;

      if (this.book.accessLevel === 'public' || userRole === 'admin' || this.book.accessLevel === userRole) {
        this.bookService.getBookFile(this.book.book_id).subscribe(
          (response: Blob) => {
            const mimeType = response.type;
            if (mimeType !== 'application/pdf' && 
                mimeType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              this.showDialog = true;
              this.dialogMessage = 'Định dạng file không được hỗ trợ. Chỉ hỗ trợ tải file PDF và DOCX.';
              return;
            }

            const extension = mimeType === 'application/pdf' ? '.pdf' : '.docx';
            const fileName = this.book.title + extension;
            const fileURL = URL.createObjectURL(response);

            const anchor = document.createElement('a');
            anchor.href = fileURL;
            anchor.download = fileName;
            anchor.click();

            URL.revokeObjectURL(fileURL);

            this.showDialog = true;
            this.dialogMessage = 'Tải tài liệu thành công!';
          },
          (error) => {
            console.error('Lỗi khi tải tài liệu:', error);
            this.showDialog = true;
            this.dialogMessage = 'Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.';
          }
        );
      } else {
        this.showDialog = true;
        this.dialogMessage = 'Bạn không có quyền tải tài liệu này.';
      }
    } else {
      this.showDialog = true;
      this.dialogMessage = 'Vui lòng đăng nhập để tải tài liệu.';
    }
  }

  toggleReviewSection(): void {
    this.showReviewSection = !this.showReviewSection;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMessage = '';
  }
}
