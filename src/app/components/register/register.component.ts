import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IlilceService } from '../../services/ililce.service';
import { CommonModule } from '@angular/common';
import { registerService } from '../../services/register.service'; // Düzeltilmiş import
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./css/style.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  iller: any[] = []; // İllerin listesi
  ilceler: any[] = []; // İlçelerin listesi
  selectedIlId: number; // Seçilen il ID'si

  constructor(
    private formBuilder: FormBuilder,
    private ililce: IlilceService,
    private toastrService: ToastrService,
    private registerService: registerService, // Düzeltilmiş service adı
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
    this.loadIller(); // İlleri yükle
  }

  // Formu oluşturuyoruz
  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: ['', Validators.required], // İl seçimi
      district: ['', Validators.required], // İlçe seçimi
      adress: ['', Validators.required],
      cinsiyet: ['', Validators.required],
      status: true,
      role: []
    });
  }

  loadIller() {
    this.ililce.getIller().subscribe(
      (response) => {
        if (response.success) {
          this.iller = response.data.map((il) => ({
            ...il,
            ilNo: String(il.ilNo), // `ilNo`yu string'e dönüştürüyoruz
          }));
        } else {
          this.toastrService.error('İller yüklenemedi');
        }
      },
      (error) => {
        this.toastrService.error('İller yüklenirken hata oluştu');
      }
    );
  }

  // İl seçildiğinde ilçeleri yüklemek için metod
  onIlSelect(event: Event) {
    const target = event.target as HTMLSelectElement; // Type assertion
    const ilId = target.value; // Seçilen il'in ID'si (string)

    // String'den number'a dönüştürmek için '+' operatörü
    this.selectedIlId = +ilId;

    this.ililce.getIlceler(this.selectedIlId).subscribe(
      (response) => {
        // 'response' doğrudan 'ilceModel' tipinde olacak
        this.ilceler = response.data; // 'data' içeriğini 'ilceler' dizisine atıyoruz
      },
      (error) => {
        this.toastrService.error('İlçeler yüklenirken hata oluştu');
      }
    );
  }

  onReset() {
    this.registerForm.reset(); // Formu sıfırlar
  }

  onSubmit() {
    event.preventDefault();
    console.log('Form gönderildi.', this.registerForm.value);
    if (this.registerForm != null) {
      const formData = this.registerForm.value;

      // `iladi` ve `ilceadi` bilgilerini form verisinden alıyoruz
      const userForRegisterDto: User = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.city, // `iladi` bilgisi
        district: formData.district, // `ilceadi` bilgisi
        adress: formData.adress,
        cinsiyet: formData.cinsiyet,
        status: true,
        role: []
      };

      console.log(userForRegisterDto); // Kullanıcı verilerini kontrol etmek için

      this.registerService.register(userForRegisterDto).subscribe(
        (response) => {
          this.toastrService.success('Kullanıcı başarıyla kaydedildi');
          console.log('Kullanıcı kaydedildi:', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastrService.error('Kullanıcı kaydedilemedi');
          console.error('Kayıt hatası:', error);
        }
      );
    } else {
      this.toastrService.error('Form geçerli değil.');
      console.log('Form geçerli değil.');
    }
  }
}
