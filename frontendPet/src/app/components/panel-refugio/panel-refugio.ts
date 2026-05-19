import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Animal, EstadoAdopcion, Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { FooterComponent } from '../footer/footer';

type AnimalForm = Omit<Animal, 'id'>;

@Component({
  selector: 'app-panel-refugio',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgFor,
    NgIf,
    NavbarComponent,
    ImageUploadComponent,
    FooterComponent,
  ],
  templateUrl: './panel-refugio.html',
  styleUrl: './panel-refugio.css',
})
export class PanelRefugioComponent implements OnInit {
  animales: Animal[] = [];
  editandoId: number | null = null;
  form: AnimalForm = this.formVacio();

  // ── Opciones para los desplegables ──────────────────────────
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
  estadosSaludDisponibles = ['Bueno', 'Regular', 'Malo'];

  // ── Validaciones ──────────────────────────────────────────
  errorAnimal = { nombre: '', especie: '', genero: '' };

  // ── Perfil del refugio ──
  perfil = { nombre: '', descripcion: '', foto: '', telefono: '' };
  guardandoPerfil = false;
  perfilGuardado = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.perfil = {
      nombre: user.nombre ?? '',
      descripcion: user.descripcion ?? '',
      foto: user.foto ?? '',
      telefono: user.telefono ?? '',
    };
  }

  guardarPerfil(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.guardandoPerfil = true;
    this.perfilGuardado = false;

    // El backend valida @Valid, así que enviamos email también (aunque no lo actualice)
    const payload = {
      ...this.perfil,
      email: user.email,
    };

    this.apiService.editarPerfilRefugio(user.id, payload).subscribe({
      next: (actualizado) => {
        // Refresca la sesión local con los datos nuevos
        const token = this.authService.getBasicToken();
        if (token) {
          localStorage.setItem('petconnect_usuario', JSON.stringify(actualizado));
        }
        this.guardandoPerfil = false;
        this.perfilGuardado = true;
        setTimeout(() => (this.perfilGuardado = false), 3000);
      },
      error: () => (this.guardandoPerfil = false),
    });
  }

  cargarAnimales(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.apiService
      .getAnimalesDeRefugio(user.id)
      .subscribe((animales) => (this.animales = animales));
  }

  editar(animal: Animal): void {
    this.editandoId = animal.id;
    this.form = {
      nombre: animal.nombre,
      especie: animal.especie,
      raza: animal.raza,
      edad: animal.edad,
      genero: animal.genero,
      estadoSalud: animal.estadoSalud,
      descripcion: animal.descripcion,
      ubicacion: animal.ubicacion,
      foto: animal.foto,
      estadoAdopcion: animal.estadoAdopcion,
    };
    // Resetear errores al editar
    this.errorAnimal = { nombre: '', especie: '', genero: '' };
  }

  guardar(): void {
    // Resetear errores
    this.errorAnimal = { nombre: '', especie: '', genero: '' };

    // Validaciones
    if (!this.form.nombre || !this.form.nombre.trim()) {
      this.errorAnimal.nombre = 'El nombre del animal es obligatorio';
      return;
    }

    if (!this.form.especie) {
      this.errorAnimal.especie = 'Debe seleccionar una especie';
      return;
    }

    if (!this.form.genero) {
      this.errorAnimal.genero = 'Debe seleccionar el género';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) return;

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
    if (!confirm('¿Seguro que quieres borrar este animal?')) return;
    this.apiService.borrarAnimal(id).subscribe(() => this.cargarAnimales());
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.form = this.formVacio();
    this.errorAnimal = { nombre: '', especie: '', genero: '' };
  }

  private formVacio(): AnimalForm {
    return {
      nombre: '',
      especie: '',
      raza: '',
      edad: undefined,
      genero: '',
      estadoSalud: '',
      descripcion: '',
      ubicacion: '',
      foto: '',
      estadoAdopcion: 'DISPONIBLE' as EstadoAdopcion,
    };
  }
}
