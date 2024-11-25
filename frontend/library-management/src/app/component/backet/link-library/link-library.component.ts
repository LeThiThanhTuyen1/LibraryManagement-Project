import { Component, OnInit } from '@angular/core';
import { LinkLibraries } from '../../../model/link-library.model';
import { LinkLibraryService } from '../../../service/link-library.service';

@Component({
  selector: 'app-link-library',
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.css'
})
export class LinkLibraryComponent implements OnInit {

  libraries: LinkLibraries[] = [];
  selectedLibrary: LinkLibraries | null = null;

 
  constructor(private linkLibraryService: LinkLibraryService){}
    ngOnInit(): void {
    this.getLinkLibraries();
  }

  getLinkLibraries(): void {
    this.linkLibraryService.getLinkLibraries()
      .subscribe(libraries => this.libraries = libraries)};  
      onLibrarySelect(event: any): void {
        const selectedLink = event.target.value;  // Get the link text (URL) of the selected library
        if (selectedLink) {
          // Open the selected library's link in a new tab
          window.open(selectedLink, '_blank');
        }
      }  
    }
      
  

