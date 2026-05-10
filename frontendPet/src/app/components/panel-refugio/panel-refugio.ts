import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Animal, EstadoAdopcion } from '../../models/types';

type AnimalForm = Omit<Animal, 'id'>;

@Component({
  selector: 'app-panel-refugio',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor],
  templateUrl: './panel-refugio.html',
  styleUrl: './panel-refugio.css',
})
export class PanelRefugioComponent implements OnInit {
  animales: Animal[] = [];
  editandoId: number | null = null;
  form: AnimalForm = this.formVacio();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
  }

  cargarAnimales(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }
    this.apiService.getAnimalesDeRefugio(user.id).subscribe((animales) => (this.animales = animales));
  }

  editar(animal: Animal): void {
    this.editandoId = animal.id;
    this.form = {
      nombre: animal.nombre,
      especie: animal.especie,
      raza: animal.raza,
      edad: animal.edad,
      estadoSalud: animal.estadoSalud,
      ubicacion: animal.ubicacion,
      foto: animal.foto,
      estadoAdopcion: animal.estadoAdopcion,
    };
  }

  guardar(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    if (this.editandoId) {
      this.apiService.editarAnimal(this.editandoId, this.form).subscribe(() => {
        this.cancelarEdicion();
        this.cargarAnimales();
      });
      return;
    }

    this.apiService.crearAnimal(user.id, this.form).subscribe(() => {
      this.form = this.formVacio();
      this.cargarAnimales();
    });
  }

  borrar(id: number): void {
    this.apiService.borrarAnimal(id).subscribe(() => this.cargarAnimales());
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.form = this.formVacio();
  }

  private formVacio(): AnimalForm {
    return {
      nombre: '',
      especie: '',
      raza: '',
      edad: undefined,
      estadoSalud: '',
      ubicacion: '',
      foto: '',
      estadoAdopcion: 'DISPONIBLE' as EstadoAdopcion,
    };
  }
}
