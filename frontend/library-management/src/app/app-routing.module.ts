import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/backet/login/login.component';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { ForgotPasswordComponent } from './component/backet/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/backet/reset-password/reset-password.component';
import { LinkLibraryComponent } from './component/backet/link-library/link-library.component';
import { LecturerInfoComponent } from './component/lecturer-info/lecturer-info.component';
import { UserInformationComponent } from './component/backet/user-information/user-information.component';
import { FavoriteListComponent } from './component/user/favorite-list/favorite-list.component';
import { SearchDocumentsComponent } from './component/user/search-documents/search-documents.component';
import { BookReviewComponent } from './book-review/book-review.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'header', component: HeaderComponent},
  { path: 'footer', component: FooterComponent},
  { path: 'home-admin', component: HomeAdminComponent},
  { path: 'home', component: HomeComponent},
  { path: 'book-list', component: BookListComponent},
  { path: 'link-library', component: LinkLibraryComponent},
  { path: 'lecturer-info', component: LecturerInfoComponent },
  { path: 'user-information', component: UserInformationComponent }, 
  { path: 'favorite-list', component: FavoriteListComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'search-documents', component: SearchDocumentsComponent},
  { path: 'book-detail/:id', component: BookDetailComponent},
  { path: 'book-review/:bookId', component: BookReviewComponent },
  { path: '', redirectTo: '/book-detail', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
