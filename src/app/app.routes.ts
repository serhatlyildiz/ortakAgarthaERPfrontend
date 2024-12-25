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
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserUpdateComponent } from './components/admin-user-update/admin-user-update.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductOperationComponent } from './components/product-operation/product-operation.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProductStockUpdateComponent } from './components/product-stock-update/product-stock-update.component';
import { ProductStockOpComponent } from './components/product-stock-op/product-stock-op.component';
import { ProductStockAddComponent } from './components/product-stock-add/product-stock-add.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProductStatusHistoryComponent } from './components/product-status-history/product-status-history.component';
import { ToastrModule } from 'ngx-toastr';

export const routes: Routes = [
  /*
  { path: '', pathMatch: 'full', component: ProductComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/:superCategoryId/:categoryId', component: ProductComponent },
  { path: 'products/:superCategoryId', component: ProductComponent },
  { path: 'products/category/:categoryId', component: ProductComponent },
  {
    path: 'products-add',
    component: ProductAddComponent,
    canActivate: [LoginGuard],
  },
  { path: 'admin-user-update/:productId', component: AdminUserUpdateComponent, canActivate: [LoginGuard]  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [LoginGuard] },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  //{ path: 'product-operations', component: ProductOperationComponent},
  { path: 'product-status-history', component: ProductStatusHistoryComponent},
  {
    path: 'product-operations/:productCode/:productId',
    component: ProductOperationComponent, canActivate: [LoginGuard]
  },
  { path: 'password-reset', component: PasswordResetComponent },
  {
    path: 'product-stock-update/:productStockId',
    component: ProductStockUpdateComponent, canActivate: [LoginGuard]
  },
  { path: 'product-stock-op', component: ProductStockOpComponent, canActivate: [LoginGuard] },
  {
    path: 'product-stock-add/:productCode/:productId',
    component: ProductStockAddComponent, canActivate: [LoginGuard]
  },
  { path: 'product-stock-add', component: ProductStockAddComponent, canActivate: [LoginGuard] },
  { path: 'contact', component: ContactComponent },
   */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NgbDropdownModule,
    ToastrModule.forRoot(),
  ],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppRoutingModule {}
