import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css',
})
export class PasswordResetComponent implements OnInit {
  token: string = '';
  password1: string = '';
  password2: string = '';
  errorMessage: string = ''; // Hata mesajını göstermek için
  isButtonEnabled: boolean = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // URL'den token alınıyor
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  // Şifre kontrolü ve hata mesajı ayarı
  checkPasswords(): void {
    if (this.password1.trim() === '' || this.password2.trim() === '') {
      this.errorMessage = 'Tüm alanları doldurun.';
      this.isButtonEnabled = false;
    } else if (this.password1 !== this.password2) {
      this.errorMessage = 'Girdiğiniz şifreler uyuşmuyor.';
      this.isButtonEnabled = false;
    } else {
      this.errorMessage = '';
      this.isButtonEnabled = true;
    }
  }

  // Şifre sıfırlama işlemi
  password(): void {
    if (!this.isButtonEnabled) return;

    this.authService.passwordReset(this.token, this.password1).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.toastrService.error(err.error?.message);
        this.isButtonEnabled = false;
      },
    });
  }
}
