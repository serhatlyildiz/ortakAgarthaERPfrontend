import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { ProductComponent } from './app/components/product/product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/components/login/login.component';
import { ProductAddComponent } from './app/components/product-add/product-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { LoginGuard } from './app/guards/login.guard';
import { RegisterComponent } from './app/components/register/register.component';
import { AdminComponent } from './app/components/admin/admin.component';
import { ForgotPasswordComponent } from './app/components/forgot-password/forgot-password.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserUpdateComponent } from './app/components/admin-user-update/admin-user-update.component';
import { ProductDetailComponent } from './app/components/product-detail/product-detail.component';
import { ProductOperationComponent } from './app/components/product-operation/product-operation.component';
import { PasswordResetComponent } from './app/components/password-reset/password-reset.component';
import { CartSummaryComponent } from './app/components/cart-summary/cart-summary.component';
import { ProductStockUpdateComponent } from './app/components/product-stock-update/product-stock-update.component';
import { ProductStockOpComponent } from './app/components/product-stock-op/product-stock-op.component';
import { ProductStockAddComponent } from './app/components/product-stock-add/product-stock-add.component';
import { ContactComponent } from './app/components/contact/contact.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'products', component: ProductComponent },
  {
    path: 'products-add',
    component: ProductAddComponent,
    canActivate: [LoginGuard],
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'products/category/:categoryId', component: ProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-user-update/:productId', component: AdminUserUpdateComponent },
  { path: 'admin', component: AdminComponent, canActivate: [LoginGuard] },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  //{ path: 'product-operations', component: ProductOperationComponent },
  {
    path: 'product-operations/:productCode/:productId',
    component: ProductOperationComponent,
  },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'cart-summary', component: CartSummaryComponent },
  {
    path: 'product-stock-update/:productStockId',
    component: ProductStockUpdateComponent,
  },
  { path: 'product-stock-op', component: ProductStockOpComponent },
  {
    path: 'product-stock-add/:productCode/:productId',
    component: ProductStockAddComponent,
  },
  { path: 'product-stock-add', component: ProductStockAddComponent },
  { path: 'contact', component: ContactComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    importProvidersFrom(
      FormsModule,
      BrowserModule,
      RouterModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      NgbDropdownModule
    ),
    {
      provide: [HTTP_INTERCEPTORS],
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
