import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerInfoComponent } from './lecturer-info.component';

describe('LecturerInfoComponent', () => {
  let component: LecturerInfoComponent;
  let fixture: ComponentFixture<LecturerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecturerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
