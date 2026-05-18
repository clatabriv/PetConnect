// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { Location } from '@angular/common';
// import { NgFor, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ApiService } from '../../services/api';
// import { AuthService } from '../../services/auth';
// import { Animal, Usuario } from '../../models/types';
// import { NavbarComponent } from '../navbar/navbar';

// @Component({
//   selector: 'app-detalle-animal',
//   standalone: true,
//   imports: [RouterLink, NgFor, NgIf, FormsModule, NavbarComponent],
//   templateUrl: './detalle-animal.html',
//   styleUrl: './detalle-animal.css',
// })
// export class DetalleAnimalComponent implements OnInit {
//   animal: Animal | null = null;
//   refugio: Usuario | null = null;
//   cargando = true;
//   error = '';

//   // Para favoritos
//   esFavorito = false;
//   cargandoFavorito = false;

//   // Para solicitudes
//   mostrarFormSolicitud = false;
//   mensajeSolicitud = '';
//   enviandoSolicitud = false;
//   solicitudEnviada = false;
//   yaSolicitado = false; // Nueva bandera para verificar si ya existe solicitud
//   verificandoSolicitud = false;

//   constructor(
//     private route: ActivatedRoute,
//     private apiService: ApiService,
//     public authService: AuthService,
//     private location: Location,
//   ) {}

//   ngOnInit(): void {
//     const idParam = this.route.snapshot.paramMap.get('id');
//     const id = idParam ? Number(idParam) : NaN;
//     if (!id || Number.isNaN(id)) {
//       this.error = 'Animal no válido.';
//       this.cargando = false;
//       return;
//     }
//     this.cargar(id);
//   }

//   private cargar(id: number): void {
//     this.cargando = true;
//     this.apiService.getAnimal(id).subscribe({
//       next: (animal) => {
//         this.animal = animal;

//         // Cargar refugio si existe refugioId
//         if (animal.refugioId) {
//           this.apiService.getRefugioPublico(animal.refugioId).subscribe({
//             next: (refugio) => {
//               this.refugio = refugio;
//               this.cargando = false;
//             },
//             error: () => {
//               this.cargando = false;
//             },
//           });
//         } else {
//           this.cargando = false;
//         }

//         // Verificar si es favorito (solo para adoptantes)
//         if (this.authService.hasRole('ADOPTANTE', 'ADMIN')) {
//           this.verificarFavorito();
//           this.verificarSolicitudExistente();
//         }
//       },
//       error: () => {
//         this.error = 'No se ha podido cargar el animal.';
//         this.cargando = false;
//       },
//     });
//   }

//   private verificarFavorito(): void {
//     this.apiService.getMisFavoritos().subscribe({
//       next: (favoritos) => {
//         this.esFavorito = favoritos.some((f) => f.id === this.animal?.id);
//       },
//       error: () => {
//         this.esFavorito = false;
//       },
//     });
//   }

//   private verificarSolicitudExistente(): void {
//     const user = this.authService.getCurrentUser();
//     if (!user || !this.animal) return;

//     this.verificandoSolicitud = true;
//     this.apiService.getSolicitudesDeAdoptante(user.id).subscribe({
//       next: (solicitudes) => {
//         // Verificar si ya existe una solicitud PENDIENTE para este animal
//         this.yaSolicitado = solicitudes.some(
//           (s) => s.animal.id === this.animal?.id && s.estadoSolicitud === 'PENDIENTE',
//         );
//         this.verificandoSolicitud = false;
//       },
//       error: () => {
//         this.verificandoSolicitud = false;
//       },
//     });
//   }

//   toggleFavorito(): void {
//     if (!this.animal || this.cargandoFavorito) return;
//     const user = this.authService.getCurrentUser();
//     if (!user) return;

//     this.cargandoFavorito = true;

//     if (this.esFavorito) {
//       this.apiService.eliminarFavorito(user.id, this.animal.id).subscribe({
//         next: () => {
//           this.esFavorito = false;
//           this.cargandoFavorito = false;
//         },
//         error: () => {
//           this.cargandoFavorito = false;
//         },
//       });
//     } else {
//       this.apiService.agregarFavorito(user.id, this.animal.id).subscribe({
//         next: () => {
//           this.esFavorito = true;
//           this.cargandoFavorito = false;
//         },
//         error: () => {
//           this.cargandoFavorito = false;
//         },
//       });
//     }
//   }

//   abrirFormSolicitud(): void {
//     if (this.yaSolicitado) return;
//     this.mostrarFormSolicitud = true;
//   }

//   cerrarFormSolicitud(): void {
//     this.mostrarFormSolicitud = false;
//     this.mensajeSolicitud = '';
//   }

//   enviarSolicitud(): void {
//     if (!this.animal || this.enviandoSolicitud || this.yaSolicitado) return;
//     const user = this.authService.getCurrentUser();
//     if (!user) return;

//     this.enviandoSolicitud = true;
//     this.apiService
//       .crearSolicitud(user.id, this.animal.id, { mensaje: this.mensajeSolicitud })
//       .subscribe({
//         next: () => {
//           this.enviandoSolicitud = false;
//           this.solicitudEnviada = true;
//           this.yaSolicitado = true; // Marcar como ya solicitado
//           this.mostrarFormSolicitud = false;
//           setTimeout(() => (this.solicitudEnviada = false), 5000);
//         },
//         error: (err) => {
//           console.error('Error al crear solicitud:', err);
//           this.enviandoSolicitud = false;
//           alert('No se pudo enviar la solicitud. Verifica que tengas permisos.');
//         },
//       });
//   }

//   volver(): void {
//     this.location.back();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Animal, Usuario } from '../../models/types';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-detalle-animal',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule, NavbarComponent],
  templateUrl: './detalle-animal.html',
  styleUrl: './detalle-animal.css',
})
export class DetalleAnimalComponent implements OnInit {
  animal: Animal | null = null;
  refugio: Usuario | null = null;
  cargando = true;
  error = '';

  // Para favoritos
  esFavorito = false;
  cargandoFavorito = false;

  // Para solicitudes
  mostrarFormSolicitud = false;
  mensajeSolicitud = '';
  enviandoSolicitud = false;
  solicitudEnviada = false;
  yaSolicitado = false; // Nueva bandera para verificar si ya existe solicitud
  verificandoSolicitud = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!id || Number.isNaN(id)) {
      this.error = 'Animal no válido.';
      this.cargando = false;
      return;
    }
    this.cargar(id);
  }

  private cargar(id: number): void {
    this.cargando = true;
    this.apiService.getAnimal(id).subscribe({
      next: (animal) => {
        this.animal = animal;

        // Cargar refugio si existe refugioId
        if (animal.refugioId) {
          this.apiService.getRefugioPublico(animal.refugioId).subscribe({
            next: (refugio) => {
              this.refugio = refugio;
              this.cargando = false;
            },
            error: () => {
              this.cargando = false;
            },
          });
        } else {
          this.cargando = false;
        }

        // Verificar si es favorito (solo para adoptantes)
        if (this.authService.hasRole('ADOPTANTE', 'ADMIN')) {
          this.verificarFavorito();
          this.verificarSolicitudExistente();
        }
      },
      error: () => {
        this.error = 'No se ha podido cargar el animal.';
        this.cargando = false;
      },
    });
  }

  private verificarFavorito(): void {
    this.apiService.getMisFavoritos().subscribe({
      next: (favoritos) => {
        this.esFavorito = favoritos.some((f) => f.id === this.animal?.id);
      },
      error: () => {
        this.esFavorito = false;
      },
    });
  }

  private verificarSolicitudExistente(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.animal) return;

    this.apiService.existeSolicitud(user.id, this.animal.id).subscribe({
      next: (res) => {
        this.yaSolicitado = res.yaSolicitado;
      },
      error: () => {
        this.yaSolicitado = false;
      },
    });
  }

  toggleFavorito(): void {
    if (!this.animal || this.cargandoFavorito) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.cargandoFavorito = true;

    if (this.esFavorito) {
      this.apiService.eliminarFavorito(user.id, this.animal.id).subscribe({
        next: () => {
          this.esFavorito = false;
          this.cargandoFavorito = false;
        },
        error: () => {
          this.cargandoFavorito = false;
        },
      });
    } else {
      this.apiService.agregarFavorito(user.id, this.animal.id).subscribe({
        next: () => {
          this.esFavorito = true;
          this.cargandoFavorito = false;
        },
        error: () => {
          this.cargandoFavorito = false;
        },
      });
    }
  }

  abrirFormSolicitud(): void {
    if (this.yaSolicitado) return;
    this.mostrarFormSolicitud = true;
  }

  cerrarFormSolicitud(): void {
    this.mostrarFormSolicitud = false;
    this.mensajeSolicitud = '';
  }

  enviarSolicitud(): void {
    if (!this.animal || this.enviandoSolicitud || this.yaSolicitado) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.enviandoSolicitud = true;
    this.apiService
      .crearSolicitud(user.id, this.animal.id, { mensaje: this.mensajeSolicitud })
      .subscribe({
        next: () => {
          this.enviandoSolicitud = false;
          this.solicitudEnviada = true;
          this.yaSolicitado = true; // Marcar como ya solicitado
          this.mostrarFormSolicitud = false;
          setTimeout(() => (this.solicitudEnviada = false), 5000);
        },
        error: (err) => {
          console.error('Error al crear solicitud:', err);
          this.enviandoSolicitud = false;

          // Manejo específico de errores
          if (err.status === 409) {
            alert('Ya tienes una solicitud pendiente para este animal.');
            this.yaSolicitado = true;
            this.mostrarFormSolicitud = false;
          } else if (err.status === 403) {
            alert('No tienes permisos para realizar esta acción.');
          } else {
            alert('No se pudo enviar la solicitud. Inténtalo de nuevo.');
          }
        },
      });
  }

  volver(): void {
    this.location.back();
  }
}
