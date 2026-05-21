import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal, EstadoAdopcion, Rol, Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { FooterComponent } from '../footer/footer';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    NavbarComponent,
    ImageUploadComponent,
    FooterComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css',
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  animales: Animal[] = [];
  refugiosPendientes: Usuario[] = [];

  // Formulario de usuario
  formUsuario: Partial<Usuario> & { password?: string } = {
    nombre: '',
    email: '',
    password: '',
    rol: 'ADOPTANTE',
    descripcion: '',
    foto: '',
    telefono: '',
  };

  editandoUsuarioId: number | null = null;
  errorUsuario: Record<string, string> = {};

  // Formulario de animal
  formAnimal: Partial<Animal> = {
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
    refugioId: undefined,
  };

  editandoAnimalId: number | null = null;
  errorAnimal: Record<string, string> = {};

  rolesDisponibles: Rol[] = ['ADOPTANTE', 'REFUGIO', 'ADMIN'];
  especiesDisponibles = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
  generosDisponibles = ['Macho', 'Hembra'];
  estadosSaludDisponibles = ['Sano', 'En tratamiento', 'Necesita cuidados especiales'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarAnimales();
    this.cargarRefugiosPendientes();
  }

  // ──────────────────────────────────────────────────────────────
  // USUARIOS
  // ──────────────────────────────────────────────────────────────

  cargarUsuarios() {
    this.api.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  guardarUsuario() {
    this.errorUsuario = {};

    if (!this.formUsuario.nombre?.trim()) {
      this.errorUsuario['nombre'] = 'El nombre es obligatorio';
    }
    if (!this.formUsuario.email?.trim()) {
      this.errorUsuario['email'] = 'El email es obligatorio';
    }
    if (!this.editandoUsuarioId && !this.formUsuario.password?.trim()) {
      this.errorUsuario['password'] = 'La contraseña es obligatoria';
    }

    if (Object.keys(this.errorUsuario).length > 0) {
      return;
    }

    if (this.editandoUsuarioId) {
      this.api.editarUsuario(this.editandoUsuarioId, this.formUsuario).subscribe(() => {
        this.cargarUsuarios();
        this.cancelarEdicionUsuario();
      });
    } else {
      this.api.crearUsuario(this.formUsuario as Usuario & { password: string }).subscribe(() => {
        this.cargarUsuarios();
        this.limpiarFormularioUsuario();
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.mostrarFormUsuario = true;
    this.editandoUsuarioId = usuario.id;
    this.formUsuario = {
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      descripcion: usuario.descripcion || '',
      foto: usuario.foto || '',
      telefono: usuario.telefono || '',
      password: '',
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicionUsuario() {
    this.editandoUsuarioId = null;
    this.mostrarFormUsuario = false;
    this.limpiarFormularioUsuario();
  }

  limpiarFormularioUsuario() {
    this.formUsuario = {
      nombre: '',
      email: '',
      password: '',
      rol: 'ADOPTANTE',
      descripcion: '',
      foto: '',
      telefono: '',
    };
    this.errorUsuario = {};
  }

  borrarUsuario(id: number) {
    if (!confirm('¿Estás seguro de borrar este usuario?')) return;
    this.api.borrarUsuario(id).subscribe(() => {
      this.cargarUsuarios();
    });
  }

  // ──────────────────────────────────────────────────────────────
  // ANIMALES
  // ──────────────────────────────────────────────────────────────

  cargarAnimales() {
    this.api.getAnimales().subscribe((data) => {
      this.animales = data;
    });
  }

  guardarAnimal() {
    this.errorAnimal = {};

    if (!this.formAnimal.nombre?.trim()) {
      this.errorAnimal['nombre'] = 'El nombre es obligatorio';
    }
    if (!this.formAnimal.especie?.trim()) {
      this.errorAnimal['especie'] = 'La especie es obligatoria';
    }
    if (!this.formAnimal.genero?.trim()) {
      this.errorAnimal['genero'] = 'El género es obligatorio';
    }
    if (!this.formAnimal.refugioId) {
      this.errorAnimal['refugioId'] = 'El refugio es obligatorio';
    }

    if (Object.keys(this.errorAnimal).length > 0) {
      return;
    }

    if (this.editandoAnimalId) {
      this.api.editarAnimal(this.editandoAnimalId, this.formAnimal).subscribe(() => {
        this.cargarAnimales();
        this.cancelarEdicionAnimal();
      });
    } else {
      this.api.crearAnimal(this.formAnimal.refugioId!, this.formAnimal).subscribe(() => {
        this.cargarAnimales();
        this.limpiarFormularioAnimal();
      });
    }
  }

  editarAnimal(animal: Animal) {
    this.mostrarFormAnimal = true;
    this.editandoAnimalId = animal.id;
    this.formAnimal = {
      nombre: animal.nombre,
      especie: animal.especie,
      raza: animal.raza || '',
      edad: animal.edad,
      genero: animal.genero || '',
      estadoSalud: animal.estadoSalud || '',
      descripcion: animal.descripcion || '',
      ubicacion: animal.ubicacion || '',
      foto: animal.foto || '',
      estadoAdopcion: animal.estadoAdopcion,
      refugioId: animal.refugioId,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicionAnimal() {
    this.editandoAnimalId = null;
    this.mostrarFormAnimal = false;
    this.limpiarFormularioAnimal();
  }

  limpiarFormularioAnimal() {
    this.formAnimal = {
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
      refugioId: undefined,
    };
    this.errorAnimal = {};
  }

  borrarAnimal(id: number) {
    if (!confirm('¿Estás seguro de borrar este animal?')) return;
    this.api.borrarAnimal(id).subscribe(() => {
      this.cargarAnimales();
    });
  }

  getNombreRefugio(refugioId?: number): string {
    if (!refugioId) return '—';
    const refugio = this.usuarios.find((u) => u.id === refugioId && u.rol === 'REFUGIO');
    return refugio ? refugio.nombre : '—';
  }

  get refugiosDisponibles(): Usuario[] {
    return this.usuarios.filter((u) => u.rol === 'REFUGIO');
  }

  // ──────────────────────────────────────────────────────────────
  // VERIFICACIÓN DE REFUGIOS
  // ──────────────────────────────────────────────────────────────

  cargarRefugiosPendientes() {
    this.api.getRefugiosPendientes().subscribe((data) => {
      this.refugiosPendientes = data;
    });
  }

  verificarRefugio(id: number, verificado: boolean) {
    const accion = verificado ? 'verificar' : 'rechazar';
    if (!confirm(`¿Seguro que quieres ${accion} este refugio?`)) return;

    if (verificado) {
      this.api.cambiarVerificacionRefugio(id, true).subscribe(() => {
        this.cargarRefugiosPendientes();
        this.cargarUsuarios();
      });
    } else {
      // Rechazar = borrar
      this.api.borrarUsuario(id).subscribe(() => {
        this.cargarRefugiosPendientes();
        this.cargarUsuarios();
      });
    }
  }

  mostrarFormUsuario = false;
  mostrarFormAnimal = false;
}
