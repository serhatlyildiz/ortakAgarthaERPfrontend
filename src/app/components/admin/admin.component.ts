import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, ToastrModule, RouterModule, CommonModule, ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  adminForm: FormGroup;
  users: any[] = []; // Kullanıcılar dizisi

  constructor(
    private formBuilder: FormBuilder, 
    private toastrService: ToastrService, 
    private router: Router,
    private userService: UserService // UserService'i ekliyoruz
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.getUsers(); // Kullanıcıları al
  }

  createLoginForm() {
    this.adminForm = this.formBuilder.group({});
  }

  // Kullanıcıları al
  getUsers() {
    this.userService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error("Error fetching users:", err);
        this.toastrService.error("Failed to load users.");
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
    const newStatus = !user.status; // Durumu tersine çevir

    // Backend'e gönderilecek kullanıcı nesnesini hazırla
    const updatedUser = { ...user, status: newStatus };

    // Durum güncellemesi API çağrısı
    this.userService.updateUserStatus(updatedUser).subscribe({
      next: (response) => {
        user.status = newStatus; // Başarılı olursa durumu güncelle
        const statusMessage = newStatus ? 'Aktif edildi' : 'Silindi';
        this.toastrService.success(`Kullanıcı başarıyla ${statusMessage}.`);
        console.log('Kullanıcı durumu güncellendi:', response);
      },
      error: (err) => {
        console.error('Durum güncellemesi başarısız:', err);
        this.toastrService.error("Durum güncelleme işlemi başarısız.");
      }
    });
}

  // Kullanıcı rollerini görüntüle
  viewRoles(userId: number) {
    this.userService.getRolesByUserId(userId).subscribe({
      next: (roles) => {
        const rolesString = roles.join(", ");
        alert(`Roles: ${rolesString}`);
      },
      error: (err) => {
        console.error("Error fetching roles:", err);
        this.toastrService.error("Failed to load roles.");
      }
    });
  }
}
