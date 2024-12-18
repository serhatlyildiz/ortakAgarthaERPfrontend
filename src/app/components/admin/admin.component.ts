import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SortService } from '../../services/sort.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IlilceService } from '../../services/ililce.service';
import { ilModels } from '../../models/ilModels';
import { ilceModels } from '../../models/ilceModels';
import { OperationClaimsService } from '../../services/operation-claims.service';
import { OperationClaim } from '../../models/operationClaims';
import { forkJoin } from 'rxjs';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
  ],
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
  roleMap: { [key: number]: string } = {};
  roless: string[] = [];
  selectedRole: string;

  filters = {
    firstname: '',
    lastname: '',
    city: '',
    district: '',
    status: true,
    gender: '',
    role: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService,
    private sortService: SortService,
    private ililceService: IlilceService,
    private operationClaims: OperationClaimsService
  ) {}

  ngOnInit(): void {
    this.createAdminForm();
    //this.getUsers();
    this.getCities();
    this.loadRoles();
    // İlk başta aktif kullanıcıları almak için status: true olarak ayarlıyoruz
    this.filters.status = true;
    // Filtre uygulama fonksiyonunu çağırıyoruz
    this.applyFilters();
    if (Object.keys(this.roleMap).length > 0) {
      this.roless = Object.values(this.roleMap); // roleMap'teki değerleri bir diziye aktar
      this.selectedRole = this.roless[0]; // İlk öğeyi seçili yap
    }
  }

  createAdminForm() {
    this.adminForm = this.formBuilder.group({
      firstname: [''],
      city: [''],
      district: [''],
      status: ['null'],
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

          // Rolleri ID'lere göre eşliyoruz
          this.roleMap = this.roles.reduce((acc, role) => {
            acc[role.id] = role.name; // Her rolün ID'sini adıyla eşliyoruz
            return acc;
          }, {} as { [key: number]: string }); // Burada türü belirtiyoruz
        } else {
          this.toastrService.error('Roller listelenemedi');
        }
      },
      error: () => {
        this.toastrService.error('Roller yüklenirken hata oluştu');
      },
    });
  }

  getRoleName(roleId: number): string {
    if (this.roleMap[roleId]) {
      return this.roleMap[roleId]; // Eğer roleId bulunursa, adı döndür
    } else {
      const firstRole = Object.values(this.roleMap)[0]; // İlk öğeyi alıyoruz
      return firstRole || 'Unknown Role'; // Eğer ilk öğe yoksa 'Unknown Role' döndürüyoruz
    }
  }

  getUsers() {
    this.userService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users;
        // Her bir kullanıcı için city adını almak
        this.users.forEach((user) => {
          this.getCityNames(user); // Her bir kullanıcı için city adı alınacak

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
    this.filters = {
      firstname: '',
      lastname: '',
      city: '',
      district: '',
      status: null as boolean | null,
      gender: '',
      role: '',
    }; // Filtreleri sıfırlıyoruz (ya da başlangıç değerlerine ayarlıyoruz)

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
        // `city.data` bir nesne olduğu için doğrudan erişebilirsiniz
        if (city.data && city.data.iladi) {
          const ilAdi = city.data.iladi; // iladi'yi alıyoruz
          user.city = ilAdi;
        } else {
          console.error('City data is invalid.');
          this.toastrService.error('City data is not valid.');
        }
      },
      error: (err) => {
        console.error('Error fetching city:', err);
        this.toastrService.error('Failed to load city.');
      },
    });
  }

  onRoleClick(event: MouseEvent, role: any): void {
    // Tıklama olayını durdur
    event.stopPropagation();
    // Burada `selectedRole`'ü değiştirmiyoruz, sadece tıklamayı engelliyoruz.
  }

  getDistrictNames(user: User) {
    if (!user.district || isNaN(Number(user.district))) {
      return;
    }

    this.ililceService.getByIdIlce(Number(user.district)).subscribe({
      next: (district: ilceModels) => {
        // `district.data` bir nesne olduğu için doğrudan erişebilirsiniz
        if (district.data && district.data.ilce) {
          const ilceAdi = district.data.ilce; // ilce'yi alıyoruz
          user.district = ilceAdi; // Kullanıcının ilçe bilgisi güncelleniyor
        } else {
          console.error('District data is invalid.');
          this.toastrService.error('District data is not valid.');
        }
      },
      error: (err) => {
        console.error('Error fetching district:', err);
        this.toastrService.error('Failed to load district.');
      },
    });
  }

  // Kullanıcı güncelleme
  updateUser(userId: number) {
    this.router.navigate(['/admin-user-update', userId]);
  }

  toggleStatus(user: any): void {
    const userID = user.id;

    if (user.status === true) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          user.status = !user.status;
          this.toastrService.success('User status updated successfully.');
          //this.applyFilters();
        },
        error: () => this.toastrService.error('Failed to update status.'),
      });
    } else {
      this.userService.activateUser(user.id).subscribe({
        next: () => {
          user.status = !user.status;
          this.toastrService.success('User status updated successfully.');
        },
        error: () => this.toastrService.error('Failed to update status.'),
      });
    }
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    // Sıralama işlemini gerçekleştir
    this.users = this.sortService.sortByKey(
      this.users,
      column as keyof (typeof this.users)[0],
      this.sortOrder
    );
  }
}
