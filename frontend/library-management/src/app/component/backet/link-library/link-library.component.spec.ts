import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLibraryComponent } from './link-library.component';

describe('LinkLibraryComponent', () => {
  let component: LinkLibraryComponent;
  let fixture: ComponentFixture<LinkLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
