import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CloudinaryService } from '../../services/cloudinary';
import { Animal } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-animales',
  standalone: true,
  imports: [NgFor, NgIf, NavbarComponent, FormsModule, FooterComponent, ScrollToTopComponent],
  templateUrl: './animales.html',
  styleUrl: './animales.css',
})
export class AnimalesComponent implements OnInit {
  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];
  animalesVisibles: Animal[] = []; // Solo los que se muestran
  favoritosIds = new Set<number>();

  especieFiltro = '';
  generoFiltro = '';
  ubicacionFiltro = '';
  estadoFiltro = '';
  loading = false;
  cargandoMas = false;

  private pagina = 0;

  especiesDisponibles = [
    'Perro',
    'Gato',
    'Conejo',
    'Cobaya',
    'Rata',
    'Tortuga',
    'Gallina',
    'Pájaro',
    'Hámster',
  ];
  generosDisponibles = ['Macho', 'Hembra'];

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    public cloudinary: CloudinaryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
    this.cargarFavoritosSiAplica();
  }

  // Detectar cuando el usuario llega al final de la página
  @HostListener('window:scroll')
  onScroll(): void {
    const pos = window.scrollY + window.innerHeight;
    const max = document.documentElement.scrollHeight - 200;
    if (pos >= max && !this.cargandoMas) {
      this.cargarMas();
    }
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
      const coincideEspecie = this.especieFiltro ? a.especie === this.especieFiltro : true;
      const coincideGenero = this.generoFiltro ? a.genero === this.generoFiltro : true;
      const coincideUbicacion = this.ubicacionFiltro
        ? (a.ubicacion || '').toLowerCase().includes(this.ubicacionFiltro.toLowerCase())
        : true;
      const coincideEstado = this.estadoFiltro ? a.estadoAdopcion === this.estadoFiltro : true;
      return coincideEspecie && coincideGenero && coincideUbicacion && coincideEstado;
    });

    // Resetear paginación al filtrar
    this.pagina = 0;
    this.animalesVisibles = this.animalesFiltrados.slice(0, PAGE_SIZE);
  }

  private cargarMas(): void {
    const siguiente = (this.pagina + 1) * PAGE_SIZE;
    if (siguiente >= this.animalesFiltrados.length) return;

    this.cargandoMas = true;
    // Pequeño delay para que el spinner se vea y no haya salto brusco
    setTimeout(() => {
      this.pagina++;
      const hasta = (this.pagina + 1) * PAGE_SIZE;
      this.animalesVisibles = this.animalesFiltrados.slice(0, hasta);
      this.cargandoMas = false;
    }, 200);
  }

  get hayMas(): boolean {
    return this.animalesVisibles.length < this.animalesFiltrados.length;
  }

  // TrackBy para que Angular no redibuje tarjetas que no cambian
  trackById(_: number, animal: Animal): number {
    return animal.id;
  }

  esFavorito(animalId: number): boolean {
    return this.favoritosIds.has(animalId);
  }

  alternarFavorito(animalId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
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

  verDetalle(animalId: number): void {
    this.router.navigate(['/animales', animalId]);
  }

  private cargarFavoritosSiAplica(): void {
    if (!this.authService.hasRole('ADOPTANTE', 'ADMIN')) return;
    this.apiService.getMisFavoritos().subscribe({
      next: (favoritos) => {
        this.favoritosIds = new Set(favoritos.map((f) => f.id));
      },
    });
  }
}
