import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from '../backet/footer/footer.component';
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../backet/header/header.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent, 
        HeaderComponent,
        FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
