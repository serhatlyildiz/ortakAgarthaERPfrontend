import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { ProductComponent } from './app/components/product/product.component';
import 'bootstrap';  // Bootstrap'ı import ettiniz
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/components/login/login.component';
import { ProductAddComponent } from './app/components/product-add/product-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { LoginGuard } from './app/guards/login.guard';

// Rota yapılandırması
const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/add', component: ProductAddComponent, canActivate:[LoginGuard] }, // 'products/add' rotası eklendi
  { path: 'products/category/:categoryId', component: ProductComponent },
  { path: 'login', component: LoginComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // HttpClient desteği
    provideRouter(routes), // Router yapılandırması
    importProvidersFrom(
      ReactiveFormsModule,
      BrowserAnimationsModule,  // Toastr için gerekli animasyonlar
      ToastrModule.forRoot({ positionClass: "toast-bottom-right" })  // Toastr yapılandırması
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
}).catch((err) => console.error(err));
