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
  const isPublicEndpoint = req.url.endsWith('/api/login') || req.url.endsWith('/api/usuarios');

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
