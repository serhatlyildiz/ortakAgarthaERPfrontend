import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SortService } from '../../services/sort.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FilterService } from '../../services/filter.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IlilceService } from '../../services/ililce.service';
import { ilModel } from '../../models/ilModel';
import { ilModels } from '../../models/ilModels';
import { ilceModels } from '../../models/ilceModels';
import { OperationClaimsService } from '../../services/operation-claims.service';
import { OperationClaim } from '../../models/operationClaims';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgbDropdownModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  adminForm: FormGroup;
  users: User[] = [];
  cities: any[] = [];
  districts: any[] = [];
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  selecttedId: number;
  roles: OperationClaim[] = [];
  isFilterMenuOpen: boolean = false;

  filters = {
    firstname: '',
    city: '',
    district: '',
    status: null as boolean | null,
    gender: '',
    role: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService,
    private sortService: SortService,
    private filterService: FilterService,
    private ililceService: IlilceService,
    private operationClaims: OperationClaimsService,
  ) {}

  ngOnInit(): void {
    this.createAdminForm();
    this.getUsers();
    this.getCities();
    this.loadRoles();
  }

  createAdminForm() {
    this.adminForm = this.formBuilder.group({
      firstname: [''],
      city: [''],
      district: [''],
      status: ["null"],
    });

    // İl değiştiğinde ilçeleri yükleme
    this.adminForm.get('city')?.valueChanges.subscribe((cityId) => {
      this.getDistricts(cityId);
    });
  }

  loadRoles() {
    this.operationClaims.getRoles().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.data; // Veriyi alıp, roles dizisine atıyoruz
        } else {
          this.toastrService.error('Roller listelenemedi');
        }
      },
      error: () => {
        this.toastrService.error('Roller yüklenirken hata oluştu');
      },
    });
  }

  getUsers() {
    this.userService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users;
        this.users.forEach((user) => {
          this.getCityNames(user);
          this.getDistrictNames(user);
        });
      },
      error: (err) => {
        this.toastrService.error('Failed to load users.');
      },
    });
  }   
  

  getCities() {
    this.ililceService.getIller().subscribe(
      (response) => {
        if (response.success) {
          this.cities = response.data.map((il) => ({
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

  getDistricts(cityId: string) {
    const target = event.target as HTMLSelectElement; // Type assertion
    const ilId = target.value; // Seçilen il'in ID'si (string)

    // String'den number'a dönüştürmek için '+' operatörü
    this.selecttedId = +ilId;

    this.ililceService.getIlceler(this.selecttedId).subscribe(
      (response) => {
        // 'response' doğrudan 'ilceModel' tipinde olacak
        this.districts = response.data; // 'data' içeriğini 'ilceler' dizisine atıyoruz
      },
      (error) => {
        this.toastrService.error('İlçeler yüklenirken hata oluştu');
      }
    );
  }

  
  applyFilters() {
    const filters = { ...this.filters }; // Filtreleri al
    console.log(filters); // Filtreleri konsola yazdır
    this.userService.getFilteredUsers(filters).subscribe({
      next: (filteredUsers) => {
        this.users = filteredUsers; // Filtrelenmiş kullanıcıları al
  
        // Kullanıcıların şehir ve ilçe isimlerini almak
        this.users.forEach((user) => {
          this.getCityNames(user);
          this.getDistrictNames(user);
        });
  
        this.toastrService.success('Filters applied successfully.');
      },
      error: () => {
        this.toastrService.error('Failed to apply filters.');
      },
    });
  }
  
  resetFilters() {
    this.filters = {firstname: '',
      city: '',
      district: '',
      status: null as boolean | null,
      gender: '',
      role: '',} // Filtreleri sıfırlıyoruz (ya da başlangıç değerlerine ayarlıyoruz)
    
    // Kullanıcıları tekrar alıyoruz (tüm kullanıcılar olacak)
    this.userService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users; // Filtrelenmemiş tüm kullanıcıları al
        this.toastrService.success('Filters have been reset.');
        this.users.forEach((user) => {
          this.getCityNames(user);
          this.getDistrictNames(user);
        });
      },
      error: () => {
        this.toastrService.error('Failed to reset filters.');
      },
    });
  }
    
  
  onFilterMenuOpen() {
    this.isFilterMenuOpen = true;
  }

  // FILTER menüsü kapandığında
  onFilterMenuClose() {
    this.isFilterMenuOpen = false;
  }
  

  getCityNames(user: User) {
    if (!user.city || isNaN(Number(user.city))) {
      return;
    }

    this.ililceService.getByIdIl(Number(user.city)).subscribe({
      next: (city: ilModels) => {
        if (city.data?.iladi) {
          user.city = city.data.iladi;
        }
      },
      error: () => this.toastrService.error('Failed to load city.'),
    });
  }

  getDistrictNames(user: User) {
    if (!user.district || isNaN(Number(user.district))) {
      return;
    }

    this.ililceService.getByIdIlce(Number(user.district)).subscribe({
      next: (district: ilceModels) => {
        if (district.data?.ilce) {
          user.district = district.data.ilce;
        }
      },
      error: () => this.toastrService.error('Failed to load district.'),
    });
  }

  toggleStatus(user: any): void {
    const userID = user.id;

    this.userService.updateUserStatus(userID).subscribe({
      next: () => {
        user.status = !user.status;
        this.toastrService.success(`User status updated successfully.`);
      },
      error: () => this.toastrService.error('Failed to update status.'),
    });
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    // Verileri sıralamak için kullanıcı listenizi sıralayın
    this.users.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
