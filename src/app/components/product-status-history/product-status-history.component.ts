import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { ProductStatusHistoryService } from '../../services/product-status-history-service';
import { ProductStatusHistoryModel } from '../../models/productStatusHistoryModel';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-status-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-status-history.component.html',
  styleUrls: ['./product-status-history.component.css'],
})
export class ProductStatusHistoryComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  productCodes: string[] = [];
  userEmails: { email: string; fullName: string }[] = [];
  filteredRecords: ProductStatusHistoryModel[] = [];
  apiRecords: ProductStatusHistoryModel[] = [];

  // Filtreleme için kullanılacak değerler
  selectedProductCode: string | null = null;
  selectedUserEmail: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  selectedOperation: string | null = null;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private productStatusHistorySerivce: ProductStatusHistoryService,
    private router: Router,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;

    // Ürün kodlarını yükle
    this.productService.getProductDto().subscribe({
      next: (response) => {
        this.productCodes = response.data.map((product) => product.productCode);
      },
      error: (err) => {
        this.errorMessage = 'Ürün kodları yüklenemedi.';
        this.isLoading = false;
      },
    });

    // Kullanıcı bilgilerini yükle
    this.userService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.userEmails = users.map((user) => ({
          email: user.email,
          fullName: `${user.firstName} ${user.lastName} - ${user.email}`,
        }));
      },
      error: (err) => {
        this.errorMessage = 'Kullanıcılar yüklenemedi.';
        this.isLoading = false;
      },
      complete: () => {
        // İlk başta getAllDto metodunu çağırıyoruz
        this.loadAllProductStatusHistory({
          userEmail: this.selectedUserEmail,
          startDate: this.startDate,
          endDate: this.endDate,
          productCode: this.selectedProductCode,
          operations: this.selectedOperation,
        });
      },
    });
  }

  loadAllProductStatusHistory(filters: any): void {
    // Tarihleri kontrol et ve ISO string formatına dönüştür
    const validStartDate = filters.startDate ? new Date(filters.startDate).toISOString() : undefined;
    const validEndDate = filters.endDate ? new Date(filters.endDate).toISOString() : undefined;
  
    // API çağrısını yap
    this.productStatusHistorySerivce.getProductStatusHistoryWithDetails(
      filters.userEmail || undefined,
      validStartDate,  // ISO formatına dönüştürülmüş tarih
      validEndDate,    // ISO formatına dönüştürülmüş tarih
      filters.productCode || undefined,
      filters.operations || undefined
    ).subscribe({
      next: (response) => {
        // Yanıtın doğru şekilde işlenmesi
        if (Array.isArray(response)) {
          this.apiRecords = response;  // response bir dizi olduğu için doğrudan apiRecords'a atıyoruz
        } else {
          this.apiRecords = response?.data || [];
        }
  
        // remarks verisini satır başı ekleyerek düzenle
        this.apiRecords = this.apiRecords.map(record => {
          if (record.remarks) {
            // Her bir değişiklikten sonra satır başı eklemek için "." sonrasına <br> ekle
            record.remarks = record.remarks.replace(/(\.)\s*/g, '$1<br>');
          }
          return record;
        });
  
        if (this.apiRecords.length === 0) {
          this.toastrService.error('Kayıt bulunamadı');
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        this.toastrService.error('Hata', err);
        this.errorMessage = 'Kayıtlar yüklenemedi.';
        this.isLoading = false;
      }
    });
  }
  

  applyFilter(): void {
    this.isLoading = true;

    // Filtreleme parametrelerini hazırla
    const filters = {
      productCode: this.selectedProductCode,
      userEmail: this.selectedUserEmail,
      startDate: this.startDate,
      endDate: this.endDate,
      operations: this.selectedOperation,
    };

    // Tarihleri kontrol et ve Date nesnesine dönüştür
    const validStartDate = this.startDate ? new Date(this.startDate) : undefined;
    const validEndDate = this.endDate ? new Date(this.endDate) : undefined;

    // Date nesnesine dönüştürdükten sonra ISO formatına çevir
    const isoStartDate = validStartDate ? validStartDate.toISOString() : undefined;
    const isoEndDate = validEndDate ? validEndDate.toISOString() : undefined;

    // Filtreleme isteği gönder
    this.loadAllProductStatusHistory({
      userEmail: this.selectedUserEmail,
      startDate: isoStartDate,  // ISO formatında tarih
      endDate: isoEndDate,      // ISO formatında tarih
      productCode: this.selectedProductCode,
      operations: this.selectedOperation
    });
  }

  resetFilters(): void {
    this.selectedProductCode = null;
    this.selectedUserEmail = null;
    this.startDate = null;
    this.endDate = null;
    this.selectedOperation = null;
    this.applyFilter();  // Filtreleme işlemini sıfırla ve yeniden uygula
  }

  cancelButton(): void {
    this.router.navigate(['/product-stock-op']);
  }

}
