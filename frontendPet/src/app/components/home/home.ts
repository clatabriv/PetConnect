import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgClass, NavbarComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  indiceActual = 0;
  private intervalo: any;

  readonly imagenes: string[] = [
    'https://images.pexels.com/photos/34479907/pexels-photo-34479907.jpeg',
    'https://images.pexels.com/photos/6247955/pexels-photo-6247955.jpeg',
    'https://images.pexels.com/photos/36532747/pexels-photo-36532747.jpeg',
    'https://images.pexels.com/photos/25225794/pexels-photo-25225794.jpeg',
    'https://images.pexels.com/photos/16652368/pexels-photo-16652368.jpeg',
    'https://images.pexels.com/photos/17663172/pexels-photo-17663172.jpeg',
    'https://images.pexels.com/photos/16975692/pexels-photo-16975692.jpeg',
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Cambiar automáticamente cada 4 segundos
    this.intervalo = setInterval(() => {
      this.siguiente();
    }, 4000);
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando se destruye el componente
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  siguiente() {
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
  }

  anterior() {
    this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
    // Resetear el intervalo al hacer click manual
    this.resetearIntervalo();
  }

  irA(index: number) {
    this.indiceActual = index;
    this.resetearIntervalo();
  }

  private resetearIntervalo() {
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.siguiente();
    }, 4000);
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cerrarSesion() {
    this.authService.clearSession();
  }
}
