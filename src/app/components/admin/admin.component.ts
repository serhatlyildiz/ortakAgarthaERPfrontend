import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgbDropdownModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  adminForm: FormGroup;
  users: User[] = [];
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService,
    private sortService: SortService,
    private filterService: FilterService,
    private ililceService: IlilceService
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.getUsers();
  }

  createLoginForm() {
    this.adminForm = this.formBuilder.group({});
  }

  getUsers() {
    this.userService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users;
  
        // Her bir kullanıcı için city adını almak
        this.users.forEach(user => {
          this.getCityNames(user); // Her bir kullanıcı için city adı alınacak
          this.getDistrictNames(user);
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.toastrService.error('Failed to load users.');
      }
    });
  }
  
  

  getCityNames(user: User) {
    // user.city'nin geçerli bir değer olup olmadığını kontrol et
    if (!user.city || isNaN(Number(user.city))) {
      this.toastrService.error('Invalid city ID.');
      return; // Geçersiz city ID'si olduğunda fonksiyonu sonlandır
    }
  
    this.ililceService.getByIdIl(Number(user.city)).subscribe({
      next: (city: ilModels) => {
        console.log('API response:', city.data); // Gelen yanıtı logla
    
        // `city.data` bir nesne olduğu için doğrudan erişebilirsiniz
        if (city.data && city.data.iladi) {
          const ilAdi = city.data.iladi; // iladi'yi alıyoruz
          user.city = ilAdi;
          console.log('City name:', ilAdi);
        } else {
          console.error('City data is invalid.');
          this.toastrService.error('City data is not valid.');
        }
      },
      error: (err) => {
        console.error('Error fetching city:', err);
        this.toastrService.error('Failed to load city.');
      }
    });        
  }

  getDistrictNames(user: User) {
    // user.ilce'nin geçerli bir değer olup olmadığını kontrol et
    if (!user.district || isNaN(Number(user.district))) {
      this.toastrService.error('Invalid district ID.');
      return; // Geçersiz ilçe ID'si olduğunda fonksiyonu sonlandır
    }
  
    this.ililceService.getByIdIlce(Number(user.district)).subscribe({
      next: (district: ilceModels) => {
        console.log('District response:', district.data); // Gelen yanıtı logla
  
        // `district.data` bir nesne olduğu için doğrudan erişebilirsiniz
        if (district.data && district.data.ilce) {
          const ilceAdi = district.data.ilce; // ilce'yi alıyoruz
          user.district = ilceAdi; // Kullanıcının ilçe bilgisi güncelleniyor
          console.log('District name:', ilceAdi);
        } else {
          console.error('District data is invalid.');
          this.toastrService.error('District data is not valid.');
        }
      },
      error: (err) => {
        console.error('Error fetching district:', err);
        this.toastrService.error('Failed to load district.');
      }
    });
  }
  
  
  
  
  
  
  
  

  // Kullanıcı güncelleme
  updateUser(userId: number) {
    console.log(`Update user with ID: ${userId}`);
    // Gerekirse userService.updateUser(userId, data) çağrılabilir
    this.router.navigate([`/admin/update/${userId}`]); // ID'yi kullanarak güncelleme sayfasına yönlendirme
  }

  // Kullanıcı silme
  toggleStatus(user: any): void {
    const userID = user.id; // Kullanıcı ID'sini al

    // Durum güncellemesi API çağrısı
    this.userService.updateUserStatus(userID).subscribe({
      next: (response) => {
        user.status = !user.status; // Durumu tersine çevir
        const statusMessage = user.status ? 'Aktif edildi' : 'Silindi';
        this.toastrService.success(`Kullanıcı başarıyla ${statusMessage}.`);
        console.log('Kullanıcı durumu güncellendi:', response);
      },
      error: (err) => {
        console.error('Durum güncellemesi başarısız:', err);
        this.toastrService.error('Durum güncelleme işlemi başarısız.');
      },
    });
  }

  // Kullanıcı rollerini görüntüle
  viewRoles(userId: number) {
    this.userService.getRolesByUserId(userId).subscribe({
      next: (roles) => {
        const rolesString = roles.join(', ');
        alert(`Roles: ${rolesString}`);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
        this.toastrService.error('Failed to load roles.');
      },
    });
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      // Aynı kolona basılmışsa sıralama yönünü değiştir
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Farklı bir kolona basılmışsa, bu kolona göre sıralamaya başla
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

  // applyFilters() {
  //   const filters = {
  //     role: this.selectedRole,
  //     gender: this.selectedGender,
  //     status: this.selectedStatus,
  //     city: this.selectedCity,
  //   };
  //   this.filterService.setFilters(filters);
  // }
}
