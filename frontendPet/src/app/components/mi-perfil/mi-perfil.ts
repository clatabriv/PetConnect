import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { FooterComponent } from '../footer/footer';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NavbarComponent,
    ImageUploadComponent,
    FooterComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  form = { nombre: '', foto: '', ubicacion: '', descripcion: '' };

  guardando = false;
  guardado = false;
  confirmandoBorrar = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.getMiPerfil().subscribe((u) => {
      this.usuario = u;
      this.form.nombre = u.nombre;
      this.form.foto = u.foto ?? '';
      this.form.ubicacion = u.ubicacion ?? '';
      this.form.descripcion = u.descripcion ?? '';
    });
  }

  guardar() {
    this.guardando = true;
    this.guardado = false;
    this.api.actualizarMiPerfil(this.form).subscribe((u) => {
      this.usuario = u;
      // Actualizamos el usuario en sesión SIN tocar el token
      const raw = localStorage.getItem('petconnect_usuario');
      if (raw) {
        const sesion = JSON.parse(raw);
        localStorage.setItem(
          'petconnect_usuario',
          JSON.stringify({
            ...sesion,
            nombre: u.nombre,
            foto: u.foto,
          }),
        );
      }
      this.guardando = false;
      this.guardado = true;
      setTimeout(() => (this.guardado = false), 3000);
    });
  }

  solicitarBorrar() {
    this.confirmandoBorrar = true;
  }

  cancelarBorrar() {
    this.confirmandoBorrar = false;
  }

  confirmarBorrar() {
    this.api.eliminarMiCuenta().subscribe(() => {
      this.auth.clearSession();
      this.router.navigate(['/home']);
    });
  }
}
