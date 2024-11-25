import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/backet/login/login.component';
import { BookListComponent } from './component/book/book-list/book-list.component';
import { HeaderComponent } from './component/backet/header/header.component';
import { FooterComponent } from './component/backet/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { HomeAdminComponent } from './component/admin/home-admin/home-admin.component';
import { LinkLibraryComponent } from './component/backet/link-library/link-library.component';
import { UserInformationComponent } from './component/backet/user-information/user-information.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'header', component: HeaderComponent},
  { path: 'footer', component: FooterComponent},
  { path: 'home-admin', component: HomeAdminComponent},
  { path: 'home', component: HomeComponent},
  { path: 'book-list', component: BookListComponent},
  { path: 'link-library', component: LinkLibraryComponent},
  { path: 'user-information', component: UserInformationComponent }, 
  { path: '**', redirectTo: '/login', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
