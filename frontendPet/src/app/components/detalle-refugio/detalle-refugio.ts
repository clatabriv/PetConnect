import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal, Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-detalle-refugio',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NavbarComponent, FooterComponent],
  templateUrl: './detalle-refugio.html',
  styleUrl: './detalle-refugio.css',
})
export class DetalleRefugioComponent implements OnInit {
  refugio: Usuario | null = null;
  animales: Animal[] = [];
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!id || Number.isNaN(id)) {
      this.error = 'Refugio no válido.';
      this.cargando = false;
      return;
    }
    this.cargar(id);
  }

  private cargar(id: number): void {
    this.cargando = true;
    this.apiService.getRefugioPublico(id).subscribe({
      next: (refugio) => {
        this.refugio = refugio;
        this.apiService.getAnimalesDeRefugio(id).subscribe({
          next: (animales) => {
            this.animales = animales;
            this.cargando = false;
          },
          error: () => {
            this.animales = [];
            this.cargando = false;
          },
        });
      },
      error: () => {
        this.error = 'No se ha podido cargar el refugio.';
        this.cargando = false;
      },
    });
  }

  verAnimal(animalId: number): void {
    this.router.navigate(['/animales', animalId]);
  }
}
