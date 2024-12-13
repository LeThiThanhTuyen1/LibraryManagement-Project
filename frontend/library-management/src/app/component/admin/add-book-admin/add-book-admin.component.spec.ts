import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookAdminComponent } from './add-book-admin.component';

describe('AddBookAdminComponent', () => {
  let component: AddBookAdminComponent;
  let fixture: ComponentFixture<AddBookAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBookAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBookAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
