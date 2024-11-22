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
//import 'bootstrap';  // Bootstrap'ı import ettiniz
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/components/login/login.component';
import { ProductAddComponent } from './app/components/product-add/product-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { LoginGuard } from './app/guards/login.guard';
import { RegisterComponent } from './app/components/register/register.component';
import { AdminComponent } from './app/components/admin/admin.component';

// Rota yapılandırması
const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'products', component: ProductComponent },
  {
    path: 'products/add',
    component: ProductAddComponent,
    canActivate: [LoginGuard],
  }, // 'products/add' rotası eklendi
  { path: 'products/category/:categoryId', component: ProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
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
      BrowserAnimationsModule
    ),
    {
      provide: [HTTP_INTERCEPTORS],
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
