import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDocumentsComponent } from './share-documents.component';

describe('ShareDocumentsComponent', () => {
  let component: ShareDocumentsComponent;
  let fixture: ComponentFixture<ShareDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
