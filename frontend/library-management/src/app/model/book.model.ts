import { Publisher } from "./publisher.model";
export interface Book {
  book_id: number;
  title: string;
  isbn: string;
  publication_year: number;
  genre: string;
  summary: string;
  PublisherName: string;
  AuthorName: string;
  language: string;
  file_path: string;
  AverageRating: number;
  accessLevel: string;
}
