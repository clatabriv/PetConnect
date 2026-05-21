import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Animal, SolicitudAdopcion, Usuario } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // -------- USUARIOS --------
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  getRefugios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/refugios`);
  }

  getRefugioPublico(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/refugios/${id}`);
  }

  getUsuarioActual(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/me`);
  }

  crearUsuario(usuario: Partial<Usuario> & { password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  editarUsuario(
    id: number,
    usuario: Partial<Usuario> & { password?: string },
  ): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  borrarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
  }

  editarPerfilRefugio(id: number, perfil: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}/perfil`, perfil);
  }

  // -------- ANIMALES --------
  getAnimales(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/animales`);
  }

  getAnimal(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/animales/${id}`);
  }

  getAnimalesDisponibles(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/animales/disponibles`);
  }

  getAnimalesDeRefugio(refugioId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/refugios/${refugioId}/animales`);
  }

  crearAnimal(refugioId: number, animal: Partial<Animal>): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}/refugios/${refugioId}/animales`, animal);
  }

  editarAnimal(id: number, animal: Partial<Animal>): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/animales/${id}`, animal);
  }

  borrarAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/animales/${id}`);
  }

  // -------- SOLICITUDES --------
  getSolicitudes(): Observable<SolicitudAdopcion[]> {
    return this.http.get<SolicitudAdopcion[]>(`${this.apiUrl}/solicitudes`);
  }

  getSolicitudesDeAdoptante(adoptanteId: number): Observable<SolicitudAdopcion[]> {
    return this.http.get<SolicitudAdopcion[]>(
      `${this.apiUrl}/adoptantes/${adoptanteId}/solicitudes`,
    );
  }

  existeSolicitud(adoptanteId: number, animalId: number): Observable<{ yaSolicitado: boolean }> {
    return this.http.get<{ yaSolicitado: boolean }>(
      `${this.apiUrl}/adoptantes/${adoptanteId}/animales/${animalId}/solicitudes/existe`,
    );
  }

  crearSolicitud(
    adoptanteId: number,
    animalId: number,
    solicitud: { mensaje?: string },
  ): Observable<SolicitudAdopcion> {
    return this.http.post<SolicitudAdopcion>(
      `${this.apiUrl}/adoptantes/${adoptanteId}/animales/${animalId}/solicitudes`,
      solicitud,
    );
  }

  cambiarEstadoSolicitud(
    id: number,
    estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA',
  ): Observable<SolicitudAdopcion> {
    return this.http.put<SolicitudAdopcion>(`${this.apiUrl}/solicitudes/${id}/estado`, {
      estadoSolicitud,
    });
  }

  borrarSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/solicitudes/${id}`);
  }

  // -------- FAVORITOS --------
  getMisFavoritos(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/favoritos/mis`);
  }

  getFavoritosDeAdoptante(adoptanteId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/adoptantes/${adoptanteId}/favoritos`);
  }

  agregarFavorito(adoptanteId: number, animalId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/adoptantes/${adoptanteId}/favoritos/${animalId}`,
      {},
    );
  }

  eliminarFavorito(adoptanteId: number, animalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/adoptantes/${adoptanteId}/favoritos/${animalId}`);
  }

  // MI PERFIL
  getMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/me`);
  }

  actualizarMiPerfil(datos: { nombre?: string; foto?: string }): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/mi-perfil`, datos);
  }

  eliminarMiCuenta(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/mi-cuenta`);
  }
}
