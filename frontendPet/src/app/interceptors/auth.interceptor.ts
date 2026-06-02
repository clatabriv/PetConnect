import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
 * Adjunta Authorization Basic en llamadas protegidas al backend.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getBasicToken();
  const isApiCall = req.url.includes('/api/');

  // Endpoints públicos según SecurityConfig del backend
  const isPublicEndpoint =
    req.url.includes('/api/login') ||
    req.url.includes('/api/usuarios/refugios') ||
    req.url.includes('/api/animales/disponibles') ||
    (req.url.match(/\/api\/animales\/\d+$/) && req.method === 'GET') || // solo /api/animales/{id}
    (req.url.match(/\/api\/animales$/) && req.method === 'GET') || // solo /api/animales
    (req.url.includes('/api/refugios/') && req.method === 'GET') ||
    (req.url.match(/\/api\/usuarios$/) && req.method === 'POST');

  if (!token || !isApiCall || isPublicEndpoint) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${token}`,
    },
  });
  return next(authReq);
};
