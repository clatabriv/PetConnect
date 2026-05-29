import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Animal, Usuario, SolicitudAdopcion } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { FooterComponent } from '../footer/footer';
import { ScrollToTopComponent } from '../scroll-to-top/scroll-to-top';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-panel-refugio',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    DatePipe,
    NavbarComponent,
    ImageUploadComponent,
    FooterComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './panel-refugio.html',
  styleUrl: './panel-refugio.css',
})
export class PanelRefugioComponent implements OnInit {
  perfil: Partial<Usuario> & { password?: string } = {
    nombre: '',
    email: '',
    telefono: '',
    descripcion: '',
    foto: '',
    verificado: false,
    password: '',
  };

  guardandoPerfil = false;
  perfilGuardado = false;
  animales: Animal[] = [];
  solicitudesPorAnimal: Record<number, SolicitudAdopcion[]> = {};
  animalesConSolicitudes: number[] = [];
  animalExpandido: number | null = null;

  form: Partial<Animal> = {
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

  editandoId: number | null = null;
  errorAnimal: Record<string, string> = {};

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

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarPerfil();
    this.cargarAnimales();
  }

  cargarPerfil() {
    this.api.getUsuarioActual().subscribe((u) => {
      this.perfil = {
        nombre: u.nombre,
        email: u.email,
        telefono: u.telefono || '',
        descripcion: u.descripcion || '',
        foto: u.foto || '',
        verificado: u.verificado || false,
        password: '',
      };
    });
  }

  guardarPerfil() {
    this.guardandoPerfil = true;
    this.perfilGuardado = false;
    const usuario = this.auth.getCurrentUser();
    if (!usuario) return;

    // Construir objeto a enviar; solo incluir password si se ha escrito uno nuevo
    const datos: Partial<Usuario> & { password?: string } = {
      nombre: this.perfil.nombre,
      email: this.perfil.email,
      telefono: this.perfil.telefono,
      descripcion: this.perfil.descripcion,
      foto: this.perfil.foto,
    };
    if (this.perfil.password && this.perfil.password.trim()) {
      datos.password = this.perfil.password;
    }

    this.api.editarPerfilRefugio(usuario.id, datos).subscribe(() => {
      this.guardandoPerfil = false;
      this.perfilGuardado = true;
      this.perfil.password = ''; // limpiar el campo tras guardar
      setTimeout(() => (this.perfilGuardado = false), 3000);
    });
  }

  cargarAnimales() {
    const usuario = this.auth.getCurrentUser();
    if (!usuario) return;
    this.api.getAnimalesDeRefugio(usuario.id).subscribe((data) => {
      this.animales = data;
      this.animalesConSolicitudes = [];
      this.solicitudesPorAnimal = {};
      this.animales.forEach((animal) => {
        this.api.getSolicitudesDeAnimal(animal.id).subscribe({
          next: (solicitudes) => {
            this.solicitudesPorAnimal = {
              ...this.solicitudesPorAnimal,
              [animal.id]: solicitudes,
            };
            if (solicitudes.length > 0) {
              this.animalesConSolicitudes = [...this.animalesConSolicitudes, animal.id];
            }
          },
          error: () => {
            this.solicitudesPorAnimal = {
              ...this.solicitudesPorAnimal,
              [animal.id]: [],
            };
          },
        });
      });
    });
  }

  tieneSolicitudes(animalId: number): boolean {
    return this.animalesConSolicitudes.includes(animalId);
  }

  verSolicitudes(animalId: number): void {
    if (this.animalExpandido === animalId) {
      this.animalExpandido = null;
      return;
    }
    this.animalExpandido = animalId;
  }

  guardar() {
    this.errorAnimal = {};
    if (!this.form.nombre?.trim()) this.errorAnimal['nombre'] = 'El nombre es obligatorio';
    if (!this.form.especie?.trim()) this.errorAnimal['especie'] = 'La especie es obligatoria';
    if (!this.form.genero?.trim()) this.errorAnimal['genero'] = 'El género es obligatorio';
    if (Object.keys(this.errorAnimal).length > 0) return;

    const usuario = this.auth.getCurrentUser();
    if (!usuario) return;

    if (this.editandoId) {
      this.api.editarAnimal(this.editandoId, this.form).subscribe(() => {
        this.cargarAnimales();
        this.cancelarEdicion();
      });
    } else {
      this.api.crearAnimal(usuario.id, this.form).subscribe(() => {
        this.cargarAnimales();
        this.limpiarFormulario();
      });
    }
  }

  editar(animal: Animal) {
    this.editandoId = animal.id;
    this.form = {
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
    };
    setTimeout(() => {
      const formulario = document.querySelector('form');
      if (formulario) formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.form = {
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
    this.errorAnimal = {};
  }

  borrar(id: number) {
    if (!confirm('¿Estás seguro de borrar este animal?')) return;
    this.api.borrarAnimal(id).subscribe(() => this.cargarAnimales());
  }

  eliminarCuenta(): void {
    if (
      !confirm(
        '¿Estás seguro de que quieres eliminar tu refugio? Esta acción no se puede deshacer.',
      )
    )
      return;
    this.api.eliminarMiRefugio().subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/']);
      },
    });
  }
}
// force redeploy
