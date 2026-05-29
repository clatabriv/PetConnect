import { Injectable } from '@angular/core';
import { Usuario } from '../models/types';

/**
 * Gestiona la sesion local del usuario autenticado.
 * Se mantiene simple usando localStorage para facilitar el aprendizaje del proyecto.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userKey = 'petconnect_usuario';
  private readonly basicTokenKey = 'petconnect_basic_token';

  setSession(usuario: Usuario, email: string, plainPassword: string): void {
    localStorage.setItem(this.userKey, JSON.stringify(usuario));
    const token = btoa(`${email}:${plainPassword}`);
    localStorage.setItem(this.basicTokenKey, token);
  }

  clearSession(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.basicTokenKey);
  }

  getCurrentUser(): Usuario | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      this.clearSession();
      return null;
    }
  }

  getBasicToken(): string | null {
    return localStorage.getItem(this.basicTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getBasicToken();
  }

  hasRole(...roles: Usuario['rol'][]): boolean {
    const user = this.getCurrentUser();
    return !!user && roles.includes(user.rol);
  }

  logout(): void {
    localStorage.removeItem('user');
  }
}
