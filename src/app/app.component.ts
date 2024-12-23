import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NaviComponent } from './components/navi/navi.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from './services/main.service';
import { VakitModel } from './models/salahModel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NaviComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbDropdownModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'northwind';
  user: string = 'Serhat Yıldız';
  vakitModel: VakitModel[] = []
  loadingSalah = false;

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.loadSalah();
  }

  loadSalah() {
    this.mainService.loadSalah().subscribe((response) => {
      this.vakitModel = response.data.result;
      this.loadingSalah = true;
    });
  }
}
