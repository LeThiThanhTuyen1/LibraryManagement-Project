import { Component } from '@angular/core';

@Component({
  selector: 'app-approve-admin',
  templateUrl: './approve-admin.component.html',
  styleUrls: ['./approve-admin.component.css']
})
export class ApproveAdminComponent {
  documents = [
    { id: 1, documentName: 'Kinh Tế Học Cơ Bản', sender: 'Trần Văn Nam', content: 'Cuốn sách giới thiệu các khái niệm cơ bản về kinh tế học, từ lý thuyết cung cầu, thị trường, đến các mô hình kinh tế vĩ mô, nhằm giúp người đọc hiểu rõ các nguyên lý cơ bản trong nền kinh tế.' },
    { id: 2, documentName: 'Điều Kỳ Diệu Của Tư Duy Tích Cực', sender: 'Phạm Minh Đức', content: 'Cuốn sách khám phá sức mạnh của tư duy tích cực trong cuộc sống hàng ngày, đưa ra các phương pháp thực tiễn để áp dụng tư duy tích cực trong công việc và các mối quan hệ cá nhân' },
    { id: 3, documentName: 'Vượt Qua Biển Lửa', sender: 'Lê Quốc Duy', content: 'Một cuốn sách kể lại câu chuyện của những người lính cứu hỏa trong một vụ cháy lớn, mang đến thông điệp về sự kiên cường, lòng dũng cảm và trách nhiệm trong công việc.' }
  ];

  selectedDocument: any = null;
  isDetailVisible: boolean = false; // Trạng thái hiển thị bảng/chi tiết

  viewDocument(document: any) {
    this.selectedDocument = document;
    this.isDetailVisible = true; // Ẩn bảng và hiện chi tiết tài liệu
  }

  closeDetail() {
    this.selectedDocument = null;
    this.isDetailVisible = false; // Quay lại hiển thị bảng
  }

  approveDocument() {
    alert('Tài liệu đã được duyệt!');
    this.closeDetail();
  }

  rejectDocument() {
    alert('Tài liệu đã bị từ chối!');
    this.closeDetail();
  }
}
