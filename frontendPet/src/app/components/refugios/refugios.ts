import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { ApiService } from '../../services/api';
import { Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-refugios',
  standalone: true,
  imports: [NgFor, NavbarComponent, FooterComponent, ScrollToTopComponent],
  templateUrl: './refugios.html',
  styleUrl: './refugios.css',
})
export class RefugiosComponent implements OnInit {
  refugios: Usuario[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.apiService.getRefugios().subscribe({
      next: (refugios) => (this.refugios = refugios),
    });
  }

  verDetalle(refugioId: number): void {
    this.router.navigate(['/refugios', refugioId]);
  }
}
