// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { NgFor } from '@angular/common';
// import { ApiService } from '../../services/api';
// import { Animal, Rol, Usuario } from '../../models/types';

// @Component({
//   selector: 'app-panel-admin',
//   standalone: true,
//   imports: [FormsModule, RouterLink, NgFor],
//   templateUrl: './panel-admin.html',
//   styleUrl: './panel-admin.css',
// })
// export class PanelAdminComponent implements OnInit {
//   usuarios: Usuario[] = [];
//   animales: Animal[] = [];
//   nuevoUsuario = {
//     nombre: '',
//     email: '',
//     password: '',
//     rol: 'ADOPTANTE' as Rol,
//   };

//   constructor(private apiService: ApiService) {}

//   ngOnInit(): void {
//     this.recargar();
//   }

//   recargar(): void {
//     this.apiService.getUsuarios().subscribe((usuarios) => (this.usuarios = usuarios));
//     this.apiService.getAnimales().subscribe((animales) => (this.animales = animales));
//   }

//   crearUsuario(): void {
//     this.apiService.crearUsuario(this.nuevoUsuario).subscribe(() => {
//       this.nuevoUsuario = { nombre: '', email: '', password: '', rol: 'ADOPTANTE' };
//       this.recargar();
//     });
//   }

//   borrarUsuario(id: number): void {
//     this.apiService.borrarUsuario(id).subscribe(() => this.recargar());
//   }

//   borrarAnimal(id: number): void {
//     this.apiService.borrarAnimal(id).subscribe(() => this.recargar());
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal, EstadoAdopcion, Rol, Usuario } from '../../models/types';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css',
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  animales: Animal[] = [];

  // ── Crear usuario ──────────────────────────────────────────
  nuevoUsuario = { nombre: '', email: '', password: '', rol: 'ADOPTANTE' as Rol };

  // ── Editar usuario ─────────────────────────────────────────
  usuarioEditando: Usuario | null = null;
  usuarioEdit = { nombre: '', email: '', rol: 'ADOPTANTE' as Rol, password: '' };

  // ── Editar animal ──────────────────────────────────────────
  animalEditando: Animal | null = null;
  animalEdit = {
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    ubicacion: '',
    estadoAdopcion: 'DISPONIBLE' as EstadoAdopcion,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.recargar();
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
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password)
      return;
    this.apiService.crearUsuario(this.nuevoUsuario).subscribe(() => {
      this.nuevoUsuario = { nombre: '', email: '', password: '', rol: 'ADOPTANTE' };
      this.recargar();
    });
  }

  abrirEditarUsuario(u: Usuario): void {
    this.usuarioEditando = u;
    this.usuarioEdit = { nombre: u.nombre, email: u.email, rol: u.rol, password: '' };
  }

  guardarUsuario(): void {
    if (!this.usuarioEditando) return;
    const payload: Partial<Usuario> & { password?: string } = {
      nombre: this.usuarioEdit.nombre,
      email: this.usuarioEdit.email,
      rol: this.usuarioEdit.rol,
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
      ubicacion: a.ubicacion ?? '',
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
