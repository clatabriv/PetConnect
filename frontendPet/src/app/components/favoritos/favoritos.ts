import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal } from '../../models/types';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NavbarComponent, FooterComponent, ScrollToTopComponent],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class FavoritosComponent implements OnInit {
  favoritos: Animal[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.recargar();
  }

  quitarFavorito(animalId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }
    this.apiService.eliminarFavorito(user.id, animalId).subscribe(() => this.recargar());
  }

  verAnimal(animalId: number): void {
    this.router.navigate(['/animales', animalId]);
  }

  private recargar(): void {
    this.apiService.getMisFavoritos().subscribe({
      next: (animales) => (this.favoritos = animales),
    });
  }
}
