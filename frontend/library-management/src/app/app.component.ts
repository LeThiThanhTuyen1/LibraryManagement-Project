import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'library-management';
  showHeaderFooter = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/login', '/reset-password', '/forgot-password'];
        // Kiểm tra nếu đường dẫn hiện tại thuộc các đường dẫn cần ẩn header và footer
        this.showHeaderFooter = !hiddenRoutes.some(route => this.router.url.includes(route));
      }
    });
  }
}
