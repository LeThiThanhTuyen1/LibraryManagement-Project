import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SearchDocumentsComponent } from './search-documents.component';
import { StudentService } from '../../../service/student.service'; 
import { FormsModule } from '@angular/forms';

describe('SearchDocumentsComponent', () => {
  let component: SearchDocumentsComponent;
  let fixture: ComponentFixture<SearchDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchDocumentsComponent],
      imports: [HttpClientModule, FormsModule],
      providers: [StudentService] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});