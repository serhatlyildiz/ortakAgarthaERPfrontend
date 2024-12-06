import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = '';
  isButtonDisabled: boolean = false;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  forgotPassword() {
    this.isButtonDisabled = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        if (response.success === true)
          this.toastrService.success(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.toastrService.error("Lütfen geçerli bir E-Posta adresi giriniz");
        this.isButtonDisabled = false;
      },
    });
  }
}
