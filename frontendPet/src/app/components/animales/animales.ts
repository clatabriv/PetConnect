import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Animal } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-animales',
  standalone: true,
  imports: [RouterLink, NgFor, NavbarComponent, FormsModule],
  templateUrl: './animales.html',
  styleUrl: './animales.css',
})
export class AnimalesComponent implements OnInit {
  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];
  favoritosIds = new Set<number>();
  especieFiltro = '';
  ubicacionFiltro = '';
  estadoFiltro = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
    this.cargarFavoritosSiAplica();
  }

  cargarAnimales(): void {
    this.loading = true;
    this.apiService.getAnimales().subscribe({
      next: (animales) => {
        this.animales = animales;
        this.filtrar();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filtrar(): void {
    this.animalesFiltrados = this.animales.filter((a) => {
      const coincideEspecie = this.especieFiltro
        ? a.especie.toLowerCase().includes(this.especieFiltro.toLowerCase())
        : true;
      const coincideUbicacion = this.ubicacionFiltro
        ? (a.ubicacion || '').toLowerCase().includes(this.ubicacionFiltro.toLowerCase())
        : true;
      const coincideEstado = this.estadoFiltro ? a.estadoAdopcion === this.estadoFiltro : true;
      return coincideEspecie && coincideUbicacion && coincideEstado;
    });
  }

  esFavorito(animalId: number): boolean {
    return this.favoritosIds.has(animalId);
  }

  alternarFavorito(animalId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    if (this.esFavorito(animalId)) {
      this.apiService
        .eliminarFavorito(user.id, animalId)
        .subscribe(() => this.favoritosIds.delete(animalId));
      return;
    }

    this.apiService
      .agregarFavorito(user.id, animalId)
      .subscribe(() => this.favoritosIds.add(animalId));
  }

  private cargarFavoritosSiAplica(): void {
    if (!this.authService.hasRole('ADOPTANTE', 'ADMIN')) {
      return;
    }

    this.apiService.getMisFavoritos().subscribe({
      next: (favoritos) => {
        this.favoritosIds = new Set(favoritos.map((f) => f.id));
      },
    });
  }
}
