import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ToastrModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  adminForm:FormGroup;  
  constructor(private formBuilder:FormBuilder, private toastrService:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.createLoginForm(); 
  }

  createLoginForm(){
    this.adminForm = this.formBuilder.group({
      
    })
  }
}