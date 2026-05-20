import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal, EstadoAdopcion, Rol, Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NavbarComponent, ImageUploadComponent, FooterComponent],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css',
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  animales: Animal[] = [];

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

  // ── Crear usuario ──────────────────────────────────────────
  mostrarFormUsuario = false;
  nuevoUsuario = { nombre: '', email: '', password: '', rol: 'ADOPTANTE' as Rol, descripcion: '' };
  errorUsuario = { nombre: '', email: '', password: '' };

  // ── Editar usuario ─────────────────────────────────────────
  usuarioEditando: Usuario | null = null;
  usuarioEdit = {
    nombre: '',
    email: '',
    rol: 'ADOPTANTE' as Rol,
    password: '',
    foto: '',
    descripcion: '',
  };

  // ── Editar animal ──────────────────────────────────────────
  animalEditando: Animal | null = null;
  mostrarFormAnimal = false;
  refugios: Usuario[] = [];
  nuevoAnimalRefugioId: number | null = null;
  nuevoAnimal = {
    nombre: '',
    especie: '',
    raza: '',
    edad: undefined as number | undefined,
    genero: '',
    estadoSalud: '',
    descripcion: '',
    ubicacion: '',
    foto: '',
    estadoAdopcion: 'DISPONIBLE' as EstadoAdopcion,
  };
  errorAnimal = { refugio: '', nombre: '', especie: '', genero: '' };

  animalEdit = {
    nombre: '',
    especie: '',
    raza: '',
    edad: undefined as number | undefined,
    genero: '',
    estadoSalud: '',
    descripcion: '',
    ubicacion: '',
    foto: '',
    estadoAdopcion: 'DISPONIBLE' as EstadoAdopcion,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.recargar();
    this.apiService.getRefugios().subscribe((r) => (this.refugios = r));
  }

  crearAnimal(): void {
    // Resetear errores
    this.errorAnimal = { refugio: '', nombre: '', especie: '', genero: '' };

    // Validaciones
    if (!this.nuevoAnimalRefugioId) {
      this.errorAnimal.refugio = 'Debe seleccionar un refugio';
      return;
    }

    if (!this.nuevoAnimal.nombre.trim()) {
      this.errorAnimal.nombre = 'El nombre del animal es obligatorio';
      return;
    }

    if (!this.nuevoAnimal.especie) {
      this.errorAnimal.especie = 'Debe seleccionar una especie';
      return;
    }

    if (!this.nuevoAnimal.genero) {
      this.errorAnimal.genero = 'Debe seleccionar el género';
      return;
    }

    this.apiService.crearAnimal(this.nuevoAnimalRefugioId, this.nuevoAnimal).subscribe(() => {
      this.mostrarFormAnimal = false;
      this.nuevoAnimal = {
        nombre: '',
        especie: '',
        raza: '',
        edad: undefined,
        genero: '',
        estadoSalud: '',
        descripcion: '',
        ubicacion: '',
        foto: '',
        estadoAdopcion: 'DISPONIBLE',
      };
      this.nuevoAnimalRefugioId = null;
      this.errorAnimal = { refugio: '', nombre: '', especie: '', genero: '' };
      this.recargar();
    });
  }

  recargar(): void {
    this.apiService.getUsuarios().subscribe({
      next: (u) => (this.usuarios = u),
      error: (e) => console.error('Error cargando usuarios:', e),
    });
    this.apiService.getAnimales().subscribe({
      next: (a) => (this.animales = a),
      error: (e) => console.error('Error cargando animales:', e),
    });
  }

  // ── CRUD usuarios ──────────────────────────────────────────
  crearUsuario(): void {
    // Resetear errores
    this.errorUsuario = { nombre: '', email: '', password: '' };

    // Validaciones
    if (!this.nuevoUsuario.nombre.trim()) {
      this.errorUsuario.nombre = 'El nombre es obligatorio';
      return;
    }

    if (!this.nuevoUsuario.email.trim()) {
      this.errorUsuario.email = 'El email es obligatorio';
      return;
    }

    if (!this.nuevoUsuario.email.includes('@')) {
      this.errorUsuario.email = 'Debe introducir un @ en el email';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nuevoUsuario.email)) {
      this.errorUsuario.email = 'El formato del email no es válido';
      return;
    }

    if (!this.nuevoUsuario.password || this.nuevoUsuario.password.length < 4) {
      this.errorUsuario.password = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }

    this.apiService.crearUsuario(this.nuevoUsuario).subscribe(() => {
      this.mostrarFormUsuario = false;
      this.nuevoUsuario = {
        nombre: '',
        email: '',
        password: '',
        rol: 'ADOPTANTE',
        descripcion: '',
      };
      this.errorUsuario = { nombre: '', email: '', password: '' };
      this.recargar();
    });
  }

  abrirEditarUsuario(u: Usuario): void {
    this.usuarioEditando = u;
    this.usuarioEdit = {
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      password: '',
      foto: u.foto ?? '',
      descripcion: u.descripcion ?? '',
    };
  }

  guardarUsuario(): void {
    if (!this.usuarioEditando) return;
    const payload: Partial<Usuario> & { password?: string } = {
      nombre: this.usuarioEdit.nombre,
      email: this.usuarioEdit.email,
      rol: this.usuarioEdit.rol,
      foto: this.usuarioEdit.foto,
      descripcion: this.usuarioEdit.descripcion,
    };
    if (this.usuarioEdit.password) payload['password'] = this.usuarioEdit.password;

    this.apiService.editarUsuario(this.usuarioEditando.id, payload).subscribe(() => {
      this.usuarioEditando = null;
      this.recargar();
    });
  }

  cancelarUsuario(): void {
    this.usuarioEditando = null;
  }

  borrarUsuario(id: number): void {
    if (!confirm('¿Seguro que quieres borrar este usuario?')) return;
    this.apiService.borrarUsuario(id).subscribe(() => this.recargar());
  }

  // ── CRUD animales ──────────────────────────────────────────
  abrirEditarAnimal(a: Animal): void {
    this.animalEditando = a;
    this.animalEdit = {
      nombre: a.nombre,
      especie: a.especie,
      raza: a.raza ?? '',
      edad: a.edad ?? 0,
      genero: a.genero ?? '',
      estadoSalud: a.estadoSalud ?? '',
      descripcion: a.descripcion ?? '',
      ubicacion: a.ubicacion ?? '',
      foto: a.foto ?? '',
      estadoAdopcion: a.estadoAdopcion,
    };
  }

  guardarAnimal(): void {
    if (!this.animalEditando) return;
    this.apiService.editarAnimal(this.animalEditando.id, this.animalEdit).subscribe(() => {
      this.animalEditando = null;
      this.recargar();
    });
  }

  cancelarAnimal(): void {
    this.animalEditando = null;
  }

  borrarAnimal(id: number): void {
    if (!confirm('¿Seguro que quieres borrar este animal?')) return;
    this.apiService.borrarAnimal(id).subscribe(() => this.recargar());
  }
}
