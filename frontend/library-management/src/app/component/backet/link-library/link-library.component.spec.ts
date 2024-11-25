// link-library.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkLibraryComponent } from './link-library.component';
import { LinkLibraryService } from '../../../service/link-library.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LinkLibraryComponent', () => {
  let component: LinkLibraryComponent;
  let fixture: ComponentFixture<LinkLibraryComponent>;
  let linkLibraryServiceMock: any;

  beforeEach(async () => {
    // Create a mock service for LinkLibraryService
    linkLibraryServiceMock = {
      getLinkLibraries: jasmine.createSpy('getLinkLibraries').and.returnValue(of([
        { ten_thuvien: 'Thư Viện 1', link_text: 'http://link1.com' },
        { ten_thuvien: 'Thư Viện 2', link_text: 'http://link2.com' }
      ]))
    };

    await TestBed.configureTestingModule({
      declarations: [LinkLibraryComponent],
      providers: [
        { provide: LinkLibraryService, useValue: linkLibraryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLinkLibraries on initialization', () => {
    expect(linkLibraryServiceMock.getLinkLibraries).toHaveBeenCalled();
  });

  it('should populate libraries with the data from the service', () => {
    expect(component.libraries.length).toBe(2);
    expect(component.libraries[0].ten_thuvien).toBe('Thư Viện 1');
    expect(component.libraries[1].link_text).toBe('http://link2.com');
  });

  it('should open the selected library link in a new tab when an option is selected', () => {
    spyOn(window, 'open'); // Spy on the window.open method

    // Simulate selecting an option
    const selectElement = fixture.debugElement.query(By.css('.library-select')).nativeElement;
    selectElement.value = 'http://link1.com'; // Set the selected value
    selectElement.dispatchEvent(new Event('change')); // Trigger the change event

    expect(window.open).toHaveBeenCalledWith('http://link1.com', '_blank');
  });
});
