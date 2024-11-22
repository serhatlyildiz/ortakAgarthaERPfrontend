import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SortService } from '../../services/sort.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
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
    private filterService: FilterService
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
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.toastrService.error('Failed to load users.');
      },
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
