import { DebugElement, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.hasRole(["admin","product.add"])) {
      const token = localStorage.getItem("token");
      if (this.isTokenExpired(token)) {
        localStorage.removeItem('token'); // Token'ı sil
        this.router.navigate(['login']); // Login sayfasına yönlendir
        this.toastrService.info("Oturumunuz sonlandırıldı.");
        return false;
      }

      return true;
    } else {
      this.router.navigate(["login"])
      this.toastrService.info("Bu Sayfaya Yetkiniz Yoktur.")
      return false;
    }
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true; // Token yoksa geçersiz say
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Geçerli zamanı al
    return decoded.exp < currentTime; // Eğer exp süresi dolmuşsa true döner
  }
}