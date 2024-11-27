import { Component } from '@angular/core';
import { Favorite } from '../../../model/favorite.model';
import { FavoriteService } from '../../../service/favorite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent {
  favorites: Favorite[] = [];
  userId: number | null = null;
  isLoading = true; // Thêm biến để hiển thị loading khi dữ liệu đang được tải

  constructor(private favoriteService: FavoriteService, private router: Router) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.user_id;
    }

    if (this.userId) {
      this.favoriteService.getFavoritesByUserId(this.userId).subscribe({
        next: (data) => {
          console.log('Danh sách yêu thích:', data);
          this.favorites = data;
          this.isLoading = false; // Ẩn loading sau khi dữ liệu đã được tải
        },
        error: (err) => {
          console.error('Lỗi khi lấy danh sách yêu thích', err);
          this.isLoading = false; // Ẩn loading ngay cả khi có lỗi
        }
      });
    }
  }

  viewBook(id: number): void {
    this.router.navigate([`/book-detail/${id}`]); // Điều hướng đến trang chi tiết
  }
  
  // Hàm xóa yêu thích
  removeFavorite(bookId: number): void {
    console.log('Xóa sách có bookId:', bookId); // Kiểm tra bookId đã được truyền vào
    
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi danh sách yêu thích không?');
    
    if (isConfirmed) {
      // Xóa từ API trước (nếu có)
      this.favoriteService.deleteFavoriteByBookId(bookId).subscribe({
        next: () => {
          // Cập nhật danh sách trong component sau khi xóa từ API
          this.favorites = this.favorites.filter(f => f.book_id !== bookId);
          console.log('Đã xóa khỏi danh sách yêu thích từ API');
          
          // Xóa khỏi localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const userId = user.user_id;
    
            // Lấy danh sách yêu thích từ localStorage
            const favoriteBooksData = JSON.parse(localStorage.getItem('favoriteBooks') || '{}');
            let favoriteBooks = favoriteBooksData[userId] || [];
    
            // Lọc sách cần xóa khỏi danh sách yêu thích trong localStorage
            favoriteBooks = favoriteBooks.filter((f: Favorite) => f.book_id !== bookId);
    
            // Lưu lại danh sách yêu thích đã cập nhật vào localStorage
            favoriteBooksData[userId] = favoriteBooks;
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooksData));
            
            console.log('Đã xóa khỏi danh sách yêu thích trong localStorage');
          }
        },
        error: (err) => console.error('Lỗi khi xóa mục yêu thích từ API:', err)
      });
    }
  }
  
}
