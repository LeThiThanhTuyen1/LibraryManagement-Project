export interface Review {
  review_id?: number;
  book_id: number;
  user_id: number;
  rating: number;
  review_text: string;
  review_date?: Date;
  username?: string;
} 