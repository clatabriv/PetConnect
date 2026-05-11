import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { AnimalesComponent } from './components/animales/animales';
import { RefugiosComponent } from './components/refugios/refugios';
import { DetalleRefugioComponent } from './components/detalle-refugio/detalle-refugio';
import { FavoritosComponent } from './components/favoritos/favoritos';
import { PanelRefugioComponent } from './components/panel-refugio/panel-refugio';
import { PanelAdminComponent } from './components/panel-admin/panel-admin';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'animales', component: AnimalesComponent },
  { path: 'refugios', component: RefugiosComponent },
  { path: 'refugios/:id', component: DetalleRefugioComponent },
  {
    path: 'favoritos',
    component: FavoritosComponent,
    canActivate: [authGuard, roleGuard(['ADOPTANTE', 'ADMIN'])],
  },
  {
    path: 'panel-refugio',
    component: PanelRefugioComponent,
    canActivate: [authGuard, roleGuard(['REFUGIO', 'ADMIN'])],
  },
  {
    path: 'panel-admin',
    component: PanelAdminComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
