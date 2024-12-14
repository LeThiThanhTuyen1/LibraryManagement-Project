import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookService } from './service/book.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { FavoriteListComponent } from './component/user/favorite-list/favorite-list.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { LoginComponent } from './component/backet/login/login.component';
import { LinkLibraryComponent } from './component/backet/link-library/link-library.component';
import { SearchDocumentsComponent } from './component/user/search-documents/search-documents.component';
import { ForgotPasswordComponent } from './component/backet/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/backet/reset-password/reset-password.component';
import { BookReviewComponent } from './component/book/book-review/book-review.component';
import { HomeComponent } from './component/home/home.component';
import { StudentInfoComponent } from './component/user/student-info/student-info.component';
import { LecturerInfoComponent } from './component/user/lecturer-info/lecturer-info.component';
import { ShareDocumentsComponent } from './component/user/share-documents/share-documents.component';
import { AddBookAdminComponent } from './component/admin/add-book-admin/add-book-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { BookEditComponent } from './component/book/book-edit/book-edit.component';
import { ApproveAdminComponent } from './component/admin/approve-admin/approve-admin.component';


@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookDetailComponent,
    FavoriteListComponent,
    LinkLibraryComponent,
    HomeAdminComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SearchDocumentsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    BookReviewComponent,
    StudentInfoComponent,
    LecturerInfoComponent,
    ShareDocumentsComponent,
    AddBookAdminComponent,
    BookEditComponent,
    ApproveAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
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
