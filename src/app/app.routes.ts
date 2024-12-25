import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const routes: Routes = [];

@NgModule({
  imports: [ReactiveFormsModule, NgbDropdownModule],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppRoutingModule {}
