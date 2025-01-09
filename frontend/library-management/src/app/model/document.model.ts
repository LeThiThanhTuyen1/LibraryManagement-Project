
export interface Document {
  Id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  upload_date: Date;
  status: string;
  title: string;
  isbn: string;
  publication_year: number;
  genre: string;
  summary: string;
  language: string;
}
