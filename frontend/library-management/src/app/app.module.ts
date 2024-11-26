import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookService } from './service/book.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { FavoriteListComponent } from './component/user/favorite-list/favorite-list.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { LoginComponent } from './component/backet/login/login.component';
import { LinkLibraryComponent } from './component/backet/link-library/link-library.component';
import { UserInformationComponent } from './component/backet/user-information/user-information.component';
import { SearchDocumentsComponent } from './component/user/search-documents/search-documents.component';
import { HomeComponent } from './component/home/home.component';
import { LecturerInfoComponent } from './lecturer-info/lecturer-info.component';
import { StudentInfoComponent } from './student-info/student-info.component';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookDetailComponent,
    FavoriteListComponent,
    LinkLibraryComponent,
    UserInformationComponent,
    LecturerInfoComponent,
    StudentInfoComponent,
    HomeAdminComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
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
