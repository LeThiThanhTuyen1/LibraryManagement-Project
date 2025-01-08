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
          this.isLoading = false; 
        },
        error: (err) => {
          console.error('Lỗi khi lấy danh sách yêu thích', err);
          this.isLoading = false; 
          alert('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.');
        }
      });
    }
  }   

  viewBook(id: number): void {
    this.router.navigate([`/book-detail/${id}`]); 
  }
  
  removeFavorite(bookId: number): void {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi danh sách yêu thích không?');
  
    if (isConfirmed) {
      this.favoriteService.deleteFavoriteByBookId(bookId).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(f => f.book_id !== bookId);
          console.log('Đã xóa khỏi danh sách yêu thích từ API');
  
          // Update localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const userId = user.user_id;
  
            const favoriteBooksData = JSON.parse(localStorage.getItem('favoriteBooks') || '{}');
            let favoriteBooks = favoriteBooksData[userId] || [];
            
            favoriteBooks = favoriteBooks.filter((f: Favorite) => f.book_id !== bookId);
            
            favoriteBooksData[userId] = favoriteBooks;
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooksData));
            
            console.log('Đã xóa khỏi danh sách yêu thích trong localStorage');
          }
        },
        error: (err) => {
          console.error('Lỗi khi xóa mục yêu thích từ API:', err);
          alert('Không thể xóa mục yêu thích. Vui lòng thử lại sau.');
        }
      });
    }
  }  
}
