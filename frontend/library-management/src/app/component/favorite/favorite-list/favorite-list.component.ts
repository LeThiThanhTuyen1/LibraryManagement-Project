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

  constructor(private favoriteService: FavoriteService, private router: Router) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.user_id; 
    }

    if (this.userId) {
      // Gọi service để lấy danh sách yêu thích theo userId
      this.favoriteService.getFavoritesByUserId(this.userId).subscribe({
        next: (data) => {
          this.favorites = data; // Nhận dữ liệu tài liệu yêu thích bao gồm tên sách và tác giả
        },
        error: (err) => {
          console.error('Lỗi khi lấy danh sách yêu thích', err);
        }
      });
    }
  }

  removeFavorite(favoriteId: number) {
    // Hiển thị thông báo xác nhận trước khi xóa
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi danh sách yêu thích không?');
  
    if (isConfirmed) {
      // Nếu người dùng xác nhận, tiến hành xóa tài liệu
      this.favoriteService.deleteFavorite(favoriteId).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(f => f.favorite_id !== favoriteId);
          console.log('Đã xóa khỏi danh sách yêu thích');
        },
        error: (err) => {
          console.error('Lỗi khi xóa mục yêu thích:', err);
        }
      });
    } else {
      console.log('Hủy bỏ thao tác xóa');
    }
  }
}
