import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ShareDocumentsComponent } from './share-documents.component';
import { StudentService } from '../../../service/student.service';
import { BookService } from '../../../service/book.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShareDocumentsComponent', () => {
  let component: ShareDocumentsComponent;
  let fixture: ComponentFixture<ShareDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareDocumentsComponent],
      imports: [HttpClientModule, FormsModule, HttpClientTestingModule],  
      providers: [StudentService, BookService]   
    }).compileComponents();

    fixture = TestBed.createComponent(ShareDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});