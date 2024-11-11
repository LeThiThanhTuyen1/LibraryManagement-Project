import { AfterViewInit, Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    if (typeof document !== 'undefined') {
      this.initCarousel();
    } else {
      console.warn('document is not available');
    }
  }  

  initCarousel() {
    const images = document.querySelectorAll('.carousel img');
    let currentIndex = 0;

    images[currentIndex].classList.add('active');

    function showNextImage() {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }

    setInterval(showNextImage, 3000);
  }
}