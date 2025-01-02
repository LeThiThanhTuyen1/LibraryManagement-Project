export interface BookReview {
  review_id?: number;
  book_id: number;
  user_id: number;
  username?: string;
  rating: number;
  review_text: string;
  review_date: Date;
  review_updated_at?: Date;
}
