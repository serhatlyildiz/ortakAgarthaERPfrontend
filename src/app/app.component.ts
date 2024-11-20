import { RouterModule, RouterOutlet } from '@angular/router'; // RouterOutlet dahil
import { ProductComponent } from './components/product/product.component';
import { CategoryComponent } from './components/category/category.component';
import { NaviComponent } from './components/navi/navi.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { VatAddedPipe } from './pipes/vat-added.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { Component, NgModule } from '@angular/core';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
// Diğer importlar...

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    ProductComponent,
    CategoryComponent,
    NaviComponent,
    HttpClientModule,
    VatAddedPipe,
    FormsModule,
    FilterPipePipe,
    CommonModule,
    ReactiveFormsModule,
    LoginComponent,
    RegisterComponent,
    
    // Diğer bileşenler...
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'northwind';
  user: string = 'Serhat Yıldız';
}
