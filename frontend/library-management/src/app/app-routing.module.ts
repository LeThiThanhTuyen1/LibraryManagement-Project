import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/backet/login/login.component';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { ForgotPasswordComponent } from './component/backet/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/backet/reset-password/reset-password.component';
import { LinkLibraryComponent } from './component/backet/link-library/link-library.component';
import { FavoriteListComponent } from './component/user/favorite-list/favorite-list.component';
import { SearchDocumentsComponent } from './component/user/search-documents/search-documents.component';
import { BookReviewComponent } from './component/book/book-review/book-review.component';
import { HomeComponent } from './component/home/home.component';
import { StudentInfoComponent } from './component/user/student-info/student-info.component';
import { LecturerInfoComponent } from './component/user/lecturer-info/lecturer-info.component';
import { ShareDocumentsComponent } from './component/user/share-documents/share-documents.component';

import { AddBookAdminComponent } from './component/admin/add-book-admin/add-book-admin.component';

import { BookEditComponent } from './component/book/book-edit/book-edit.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'home-admin', component: HomeAdminComponent },
  { path: 'home', component: HomeComponent },
  { path: 'book-list', component: BookListComponent },
  { path: 'link-library', component: LinkLibraryComponent },
  { path: 'favorite-list', component: FavoriteListComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'search-documents', component: SearchDocumentsComponent},
  { path: 'book-detail/:id', component: BookDetailComponent},
  { path: 'book-review/:bookId', component: BookReviewComponent},
  { path: 'book-edit/:id', component: BookEditComponent },
  { path: 'student-info', component: StudentInfoComponent},
  { path: 'lecturer-info', component: LecturerInfoComponent},
  { path: 'share-documents', component: ShareDocumentsComponent},
  { path: 'add-book-admin', component: AddBookAdminComponent },
  { path: '', redirectTo: '/book-detail', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
