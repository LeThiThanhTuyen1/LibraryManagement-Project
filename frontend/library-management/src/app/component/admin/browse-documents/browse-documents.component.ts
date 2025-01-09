import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../service/document.service';
import { Document } from '../../../model/document.model';

@Component({
  selector: 'app-browse-documents',
  templateUrl: './browse-documents.component.html',
  styleUrls: ['./browse-documents.component.css']
})
export class BrowseDocumentsComponent implements OnInit {
  documents: Document[] = []; // Danh sách tài liệu

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments(); // Tải dữ liệu khi component được khởi tạo
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe(
      (data: Document[]) => {
        this.documents = data.filter(doc => doc.status === 'chờ duyệt'); // Lọc tài liệu có trạng thái "chờ duyệt"
      },
      (error) => {
        console.error('Lỗi khi tải danh sách tài liệu:', error);
      }
    );
  }

  approveDocument(id: number): void {
    this.documentService.approveDocument(id).subscribe(
      () => {
        alert('Tài liệu đã được duyệt!');
        this.loadDocuments(); // Tải lại danh sách sau khi duyệt
      },
      (error) => {
        console.error('Lỗi khi duyệt tài liệu:', error);
        alert('Lỗi khi duyệt tài liệu. Vui lòng thử lại.');
      }
    );
  }

  rejectDocument(id: number): void {
    this.documentService.rejectDocument(id).subscribe(
      () => {
        alert('Tài liệu đã bị từ chối!');
        this.loadDocuments(); // Tải lại danh sách sau khi từ chối
      },
      (error) => {
        console.error('Lỗi khi từ chối tài liệu:', error);
        alert('Lỗi khi từ chối tài liệu. Vui lòng thử lại.');
      }
    );
  }
}
