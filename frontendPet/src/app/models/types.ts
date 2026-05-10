export type Rol = 'ADOPTANTE' | 'REFUGIO' | 'ADMIN';

export type EstadoAdopcion = 'DISPONIBLE' | 'EN_PROCESO' | 'ADOPTADO';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  estadoSalud?: string;
  ubicacion?: string;
  foto?: string;
  estadoAdopcion: EstadoAdopcion;
}

export interface SolicitudAdopcion {
  id: number;
  mensaje?: string;
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  fechaSolicitud: string;
  animal: Animal;
}
