import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal, Usuario } from '../../models/types';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-detalle-refugio',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NavbarComponent],
  templateUrl: './detalle-refugio.html',
  styleUrl: './detalle-refugio.css',
})
export class DetalleRefugioComponent implements OnInit {
  refugio: Usuario | null = null;
  animales: Animal[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getUsuario(id).subscribe({
      next: (r) => (this.refugio = r),
      error: () => (this.cargando = false),
    });
    this.apiService.getAnimalesDeRefugio(id).subscribe({
      next: (a) => {
        this.animales = a.filter((x) => x.estadoAdopcion === 'DISPONIBLE');
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }
}
