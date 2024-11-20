import { Component, OnInit } from '@angular/core';
import { CartSummaryComponent } from "../cart-summary/cart-summary.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navi',
  standalone: true,
  imports: [CartSummaryComponent],
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {

  loginForm:FormGroup;
  constructor(private formBuilder:FormBuilder, private router:Router) { }

  ngOnInit(): void {

  }

  login() {
        this.router.navigate(['login']); // Yönlendirme

  }

  register() {
    this.router.navigate(['register']); // Yönlendirme

}
}
