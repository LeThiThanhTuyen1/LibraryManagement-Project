export interface BookReview {
  review_id?: number; 
    book_id: number;
    user_id: number;         // Thêm thuộc tính này để khớp với API
    rating: number;
    review_text: string;     // Sửa lại tên cho khớp với API
    review_date: Date;       // Sửa lại tên cho khớp với API
  }
  