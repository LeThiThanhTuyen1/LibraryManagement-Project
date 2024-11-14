import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    this.router.events.subscribe(() => {
      // Kiểm tra nếu đường dẫn chứa '/login' thì ẩn header và footer
      this.showHeaderFooter = !this.router.url.includes('/login');
    });
  }
}
