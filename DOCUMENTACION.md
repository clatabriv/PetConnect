# PetConnect - Documentacion tecnica y funcional

Este documento resume la arquitectura del proyecto, los flujos por rol y las rutas principales del backend y frontend.

## 1. Stack tecnico

- Backend: Spring Boot 3, Spring Security, Spring Data JPA, MySQL.
- Frontend: Angular standalone (sin modulos), Router, HttpClient, guards e interceptor.
- API Docs: Swagger/OpenAPI en `/swagger-ui/index.html`.

## 2. Roles y permisos

- `ADOPTANTE`
  - Ver home, animales y refugios.
  - Gestionar su lista de favoritos.
  - Crear solicitudes de adopcion.
- `REFUGIO`
  - Ver home, animales y refugios.
  - Gestionar CRUD de sus propios animales.
  - Gestionar estado de solicitudes de sus animales.
- `ADMIN`
  - Acceso total de gestion sobre usuarios, animales y datos globales.

## 3. Autenticacion y autorizacion

- Login: `POST /api/login` con `email` y `password`.
- Seguridad HTTP: Basic Auth para endpoints privados.
- Passwords: se almacenan con BCrypt.
- Se evita exponer passwords en respuestas JSON (`WRITE_ONLY`).

## 4. Backend - endpoints principales

### Publicos

- `POST /api/usuarios` (registro)
- `POST /api/login`
- `GET /api/animales`
- `GET /api/animales/disponibles`
- `GET /api/animales/{id}`
- `GET /api/refugios/{refugioId}/animales`
- `GET /api/usuarios/refugios`

### Favoritos

- `GET /api/favoritos/mis`
- `GET /api/adoptantes/{adoptanteId}/favoritos`
- `POST /api/adoptantes/{adoptanteId}/favoritos/{animalId}`
- `DELETE /api/adoptantes/{adoptanteId}/favoritos/{animalId}`

### Refugio/Admin (animales)

- `POST /api/refugios/{refugioId}/animales`
- `PUT /api/animales/{id}`
- `DELETE /api/animales/{id}`

### Solicitudes

- `POST /api/adoptantes/{adoptanteId}/animales/{animalId}/solicitudes`
- `GET /api/adoptantes/{adoptanteId}/solicitudes`
- `GET /api/animales/{animalId}/solicitudes`
- `PUT /api/solicitudes/{id}/estado`
- `DELETE /api/solicitudes/{id}`

### Admin (usuarios y global)

- `GET /api/usuarios`
- `GET /api/usuarios/{id}`
- `PUT /api/usuarios/{id}`
- `DELETE /api/usuarios/{id}`
- `GET /api/solicitudes`
- `GET /api/solicitudes/{id}`

## 5. Frontend - rutas

- `/home`: landing con carrusel y accesos rapidos.
- `/login`: login + registro.
- `/animales`: listado general con filtros y favoritos.
- `/refugios`: listado de refugios disponibles.
- `/favoritos`: lista personal de favoritos (ADOPTANTE/ADMIN).
- `/panel-refugio-update`: CRUD de animales del refugio logueado.
- `/panel-admin`: administracion de usuarios y animales.

## 6. Estructura clave de frontend

- `src/app/services/api.ts`: cliente HTTP tipado.
- `src/app/services/auth.ts`: sesion y roles en localStorage.
- `src/app/interceptors/auth.interceptor.ts`: inyeccion de Basic token.
- `src/app/guards/auth.guard.ts`: acceso solo autenticado.
- `src/app/guards/role.guard.ts`: acceso por rol.
- `src/app/components/*`: pantallas standalone.

## 7. Ejecucion

### Backend

1. Configurar MySQL en `backendPet/src/main/resources/application.properties`.
2. Ejecutar:
   - Windows: `mvnw.cmd spring-boot:run`
   - Linux/Mac: `./mvnw spring-boot:run`

### Frontend

1. Ir a `frontendPet`.
2. Ejecutar `npm install`.
3. Ejecutar `npm start`.

## 8. Recomendaciones para evolucion futura

- Sustituir Basic Auth por JWT con refresh token.
- Añadir DTOs formales para todas las respuestas complejas.
- Añadir test unitarios e integracion (backend y frontend).
- Añadir paginacion y ordenacion en listados grandes.
- Crear pipeline CI con build + test automatico.
