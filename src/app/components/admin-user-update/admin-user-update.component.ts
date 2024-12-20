import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserForAdmin } from '../../models/userForAdmin';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { ToastrService } from 'ngx-toastr';
import { IlilceService } from '../../services/ililce.service';

@Component({
  selector: 'app-admin-user-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-user-update.component.html',
  styleUrl: './admin-user-update.component.css',
})
export class AdminUserUpdateComponent implements OnInit {
  roles: Role[] = [];
  dataLoaded = false;
  userId: number;
  user: UserForAdmin;
  originalUser: UserForAdmin;
  dropdownOpen: boolean = false;
  iller: any[] = [];
  ilceler: any[] = [];
  selectedIlId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService,
    private toastrService: ToastrService,
    private ililce: IlilceService
  ) {}

  ngOnInit(): void {
    this.loadIller();
    this.route.params.subscribe((params) => {
      this.userId = Number(params['productId']);
    });

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (data) => {
          this.user = data.data;
          this.originalUser = { ...data.data };
          this.matchUserRoles();
          this.loadInitialIlce();
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
    this.getRoles();
  }

  loadInitialIlce(): void {
    // Eğer kullanıcı verisi ve il ID varsa, ilçeleri yükle
    if (this.user && this.user.city) {
      this.ililce.getIlceler(Number(this.user.city)).subscribe(
        (response) => {
          this.ilceler = response.data; // İlçeleri listele
          this.user.district = this.user.district; // İlçeyi seçili yap
        },
        (error) => {
          this.toastrService.error('İlçeler yüklenirken hata oluştu');
        }
      );
    }
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe((response) => {
      this.roles = response.data;
      this.matchUserRoles();
    });
  }

  matchUserRoles(): void {
    if (this.user?.roles && this.roles) {
      this.roles.forEach((dbrole) => {
        dbrole.selected = this.user.roles.includes(dbrole.id);
      });
    }
    this.dataLoaded = true;
  }

  updateUser(): void {
    this.prepareUserRoles(); // Seçili rolleri kullanıcıya ata
    console.log(this.user); //2. kontrol
    this.userService.updateUser(this.user).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.router.navigate(['/admin']); // Admin sayfasına yönlendir
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  prepareUserRoles(): void {
    // Seçili rolleri al
    const selectedRoles = this.roles
      .filter((role) => role.selected) // Seçili rolleri bul
      .map((role) => role.id); // Sadece ID'leri al
  
    // Kullanıcının rollerini güncelle
    this.user.roles = selectedRoles;
  }
  

  resetForm(): void {
    console.log(this.roles);
    this.user = { ...this.originalUser }; // Orijinal veriye dön
    this.loadInitialIlce();
    this.matchUserRoles();
    console.log('Form resetlendi:', this.user);
  }

  cancelUpdate(): void {
    console.log('Güncelleme iptal edildi');
    this.router.navigate(['/admin']);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
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
}
