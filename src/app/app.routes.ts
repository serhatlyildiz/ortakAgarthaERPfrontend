import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './components/login/login.component';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { LoginGuard } from './guards/login.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProductComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/category/:categoryId', component: ProductComponent },
  { path: 'products/add', component: ProductAddComponent, canActivate:[LoginGuard] },
  { path: "login", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  //BrowserModule,BrowserAnimationsModule, ReactiveFormsModule,
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Diğer servisler...
  ]
})
export class appRoutingModule { }