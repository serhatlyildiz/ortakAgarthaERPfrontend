import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LoginModule } from '../models/loginModel';
import { HttpClient } from '@angular/common/http';
import { TokenModel } from '../models/tokenModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';
import { ResponseModel } from '../models/responseModel';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { TokenInfo } from '../models/tokenInfo';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:5038/api/auth/';
  user: TokenInfo;

  constructor(private httpClient: HttpClient, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(loginModel: LoginModule) {
    return this.httpClient
      .post<SingleResponseModel<TokenModel>>(this.apiUrl + 'login', loginModel)
      .pipe(
        tap((response) => {
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.startTokenExpirationTimer(); // Token süresini başlat
          } else {
            console.error('Token alınamadı.');
          }
        }),
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(() => new Error(error));
        })
      );
  }

  getUsername(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return (
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ] || 'Kullanıcı'
      );
    }
    return '';
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      return token !== null && !this.isTokenExpired(token);
    }
    return false; // Tarayıcı ortamında değilse false döner
  }

  private isTokenExpired(token: string): boolean {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // ms'yi sn'ye çevir
    return decoded.exp < currentTime;
  }
    hasRole(roles: string[]): boolean {
      // Tarayıcı ortamında çalıştığından emin olun
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const userRoles: string[] =
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ] || [];
          return roles.some((role) => userRoles.includes(role));
        }
      }
      return false; // Tarayıcı ortamında değilse veya token yoksa false döner
    }

 getTokenInfo(): TokenInfo | null {
  // Check if running in the browser (client-side)
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return {
        userId: decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ],
        email: decodedToken['email'] || '',
        name: decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ] || '',
        roles:
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] || [],
      };
    }
  }
  return null; // Return null if not in the browser or token not found
}


  // Token süresi dolduğunda çıkış yapma işlemi
  private startTokenExpirationTimer() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Saniyeyi milisaniyeye çevir
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;
  
      // Token süresi dolmadan 1 dakika önce logout işlemi yap
      if (timeLeft > 0) {
        setTimeout(() => {
          this.logout();
        }, timeLeft - 60000); // 1 dakika öncesi
      }
    }
  }
  

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'request-password-reset',
      { email }
    );
  }

  passwordReset(
    resetToken: string,
    newPassword: string
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + 'reset-password', {
      resetToken,
      newPassword,
    });
  }
}
