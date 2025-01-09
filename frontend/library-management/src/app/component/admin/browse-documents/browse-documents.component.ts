import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../service/document.service';
import { Document } from '../../../model/document.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-browse-documents',
  templateUrl: './browse-documents.component.html',
  styleUrls: ['./browse-documents.component.css']
})
export class BrowseDocumentsComponent implements OnInit {
  documents: Document[] = []; // Danh sách tài liệu
  documentUrl!: SafeResourceUrl;
  showDialog: boolean = false;
  dialogMessage: string = '';
  isLoading = true;

  constructor(
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadDocuments(); // Tải dữ liệu khi component được khởi tạo
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe(
      (data: Document[]) => {
        this.documents = data.filter(doc => doc.status === 'chờ duyệt'); // Lọc tài liệu có trạng thái "chờ duyệt"
        this.isLoading = false;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách tài liệu:', error);
        this.isLoading = false;
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

  viewDocument(document: Document): void {
    this.documentService.viewDocument(document.Id).subscribe(
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
            this.showDialog = true;
            this.dialogMessage = 'Định dạng file không được hỗ trợ.';
            break;
        }
      },
      (error) => {
        console.error('Lỗi khi tải tài liệu:', error);
        this.showDialog = true;
        this.dialogMessage = 'Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.';
      }
    );
  }

  private handleDocxFile(blob: Blob, fallbackUrl: string): void {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });

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
        this.showDialog = true;
        this.dialogMessage = 'Định dạng file không được hỗ trợ.';
      }
    };
    reader.readAsArrayBuffer(blob);
  }

  closeDocumentViewer(): void {
    this.documentUrl = '';
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMessage = '';
  }
}
