import { Injectable } from "@angular/core";
import { LoginModule } from "../models/loginModel";
import { HttpClient } from "@angular/common/http";
import { TokenModel } from "../models/tokenModel";
import { SingleResponseModel } from "../models/singleResponseModel";
import { jwtDecode } from "jwt-decode";
import { catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiUrl = 'http://localhost:5038/api/auth/';

    constructor(private httpClient: HttpClient, private router: Router) { }

    login(loginModel: LoginModule) {
        return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + "login", loginModel)
            .pipe(
                tap(response => {
                    if (response.data && response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        this.startTokenExpirationTimer(); // Token süresini başlat
                    } else {
                        console.error("Token alınamadı.");
                    }
                }),
                catchError(error => {
                    console.error("Login failed", error);
                    return throwError(() => new Error(error));
                })
            );
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem("token");
        return token !== null && !this.isTokenExpired(token);
    }

    private isTokenExpired(token: string): boolean {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // ms'yi sn'ye çevir
        return decoded.exp < currentTime;
    }

    //tokendaki rolleri kontrol etme
    hasRole(roles: string[]): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const userRoles: string[] = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
            console.log('Decoded Token:', decodedToken);
            console.log('Kullanıcı Rolleri:', userRoles);
            return roles.some(role => userRoles.includes(role));
        }
        return false;
    }

    // Token süresi dolduğunda çıkış yapma işlemi
    private startTokenExpirationTimer() {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const expirationTime = decodedToken.exp * 10000; // Expiration time in milliseconds
            const currentTime = Date.now();
            const timeLeft = expirationTime - currentTime;

            // Token süresi dolmadan 1 dakika önce logout işlemi yap
            if (timeLeft > 0) {
                setTimeout(() => {
                    this.logout();
                }, timeLeft);
            }
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']); // Giriş sayfasına yönlendir
    }
}
