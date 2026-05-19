import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgClass, NavbarComponent, FooterComponent], // ← añade NavbarComponent
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  indiceActual = 0;

  readonly imagenes: string[] = [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
  ];

  constructor(public authService: AuthService) {}

  siguiente() {
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
  }

  anterior() {
    this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  irA(index: number) {
    this.indiceActual = index;
  }

  cerrarSesion() {
    this.authService.clearSession();
  }
}
