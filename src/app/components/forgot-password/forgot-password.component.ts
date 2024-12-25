import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  isButtonDisabled: boolean = false;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

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
