import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { BookService } from './service/book.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './component/login/login.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { SidebarComponent } from './component/backet/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    BookService,
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
