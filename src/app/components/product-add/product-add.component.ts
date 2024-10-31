import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastrModule, ToastrService } from 'ngx-toastr'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [ReactiveFormsModule, ToastrModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit {
  //signupUsers: any[] = [];

  productAddForm:FormGroup;
  constructor(private formBuilder:FormBuilder, 
    private productService:ProductService,
    private toastrService:ToastrService) { }

  ngOnInit():void{
    this.createProductAddForm();
  }

  createProductAddForm(){
    this.productAddForm = this.formBuilder.group({
        productName:["",[Validators.required, Validators.minLength(2)]],
        categoryId:["",Validators.required],
        unitPrice:["",[Validators.required,Validators.min(0)]],
        unitsInStock:["",[Validators.required,Validators.min(0)]] 
    });
  }

  add(){
    if(this.productAddForm.valid){
      let productModel = Object.assign({},this.productAddForm.value)
      this.productService.add(productModel).subscribe(response=>{
        this.toastrService.success(response.message,"Başarılı")
      },responseError=>{
        if(responseError.error.Errors.length>0){
          for (let i = 0; i <responseError.error.Errors.length; i++) {
            this.toastrService.error(responseError.error.Errors[i].ErrorMessage
              ,"Doğrulama hatası")
          }       
        } 
      })
    }else{
      this.toastrService.error("Formunuz Eksik", "Dikkat")
    }
  }

}
