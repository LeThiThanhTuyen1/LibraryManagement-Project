import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/backet/login/login.component';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { FavoriteListComponent } from './component/favorite/favorite-list/favorite-list.component';
import { SearchDocumentsComponent } from './search-documents/search-documents.component';
import { ForgotPasswordComponent } from './component/backet/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/backet/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'home-admin', component: HomeAdminComponent },
  { path: 'home', component: HomeComponent },
  { path: 'book-list', component: BookListComponent },
  { path: 'book-detail/:id', component: BookDetailComponent },
  { path: 'favorite-list', component: FavoriteListComponent},
  {path: 'search-documents', component: SearchDocumentsComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
