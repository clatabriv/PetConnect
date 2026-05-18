import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Rol, Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  nombreRegistro = '';
  rolRegistro: Rol = 'ADOPTANTE';
  modoRegistro = false;
  cargando = false;
  error = '';
  exito = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Autentica y redirige segun el rol del usuario.
   */
  login() {
    this.error = '';
    this.exito = '';
    this.cargando = true;
    const email = this.email.trim();
    const password = this.password.trim();

    this.apiService
      .login(email, password)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (usuario) => {
          this.authService.setSession(usuario, email, password);
          this.redirigirPorRol(usuario);
        },
        error: () => {
          this.error = 'Credenciales incorrectas o usuario sin permisos.';
        },
      });
  }

  registrar() {
    this.error = '';
    this.cargando = true;

    this.apiService
      .crearUsuario({
        nombre: this.nombreRegistro.trim(),
        email: this.email.trim(),
        password: this.password.trim(),
        rol: this.rolRegistro,
      })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this.modoRegistro = false;
          this.exito = '✓ Usuario creado. Ya puedes iniciar sesión.';
          this.error = '';
        },
        error: () => {
          this.error = 'No se pudo crear el usuario. Revisa email y campos obligatorios.';
        },
      });
  }

  toggleModo() {
    this.modoRegistro = !this.modoRegistro;
    this.error = '';
    this.exito = '';
  }

  private redirigirPorRol(usuario: Usuario) {
    if (usuario.rol === 'ADMIN') {
      this.router.navigate(['/panel-admin']);
      return;
    }
    if (usuario.rol === 'REFUGIO') {
      this.router.navigate(['/panel-refugio']);
      return;
    }
    this.router.navigate(['/home']);
  }
}
