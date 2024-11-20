import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ToastrModule, RouterModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  loginForm:FormGroup;  
  constructor(private formBuilder:FormBuilder, private authService:AuthService, private toastrService:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.createLoginForm(); 
  }

  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password:["",Validators.required]
    })
  }
//data-validate = "Valid email is required: ex@abc.xyz"
login() {
  if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      let loginModel = Object.assign({}, this.loginForm.value);
      this.authService.login(loginModel).subscribe(response => {
          this.toastrService.success(response.message);
          localStorage.setItem("token", response.data.token);

          // Token'ı decode etme
          const decodedToken: any = jwtDecode(response.data.token);
          
          // Role kontrolü
          const userRoles: string[] = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];

          // Eğer kullanıcı admin rolüne sahipse
          if (userRoles.includes('admin')) {
              this.router.navigate(['/admin']); // Admin için yönlendirme
          } else {
              this.router.navigate(['/products']); // Diğer kullanıcılar için farklı bir sayfaya yönlendirme
          }
      }, responseError => {
          this.toastrService.error(responseError.error);
      });
  }
}

}
