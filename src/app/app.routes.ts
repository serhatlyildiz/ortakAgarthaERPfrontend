import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { LoginGuard } from './guards/login.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProductComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/category/:categoryId', component: ProductComponent },
  {
    path: 'products/add',
    component: ProductAddComponent,
    canActivate: [LoginGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule, NgbDropdownModule],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class appRoutingModule {}
