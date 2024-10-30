import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest,HttpHandler,HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem("token");
    let newRequest : HttpRequest<any>;
    newRequest = request.clone({
      headers: request.headers.set("Authorization","Bearer " + token)
    })
    console.log("Authorization Header:", newRequest.headers.get("Authorization"));
    return next.handle(newRequest);
  }

  
}

/*
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
*/
