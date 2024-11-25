import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { BookService } from './service/book.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './component/backet/login/login.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { FavoriteListComponent } from './component/favorite/favorite-list/favorite-list.component';
import { SearchDocumentsComponent } from './search-documents/search-documents.component';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    HomeAdminComponent,
    BookDetailComponent,
    FavoriteListComponent,
    SearchDocumentsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
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
