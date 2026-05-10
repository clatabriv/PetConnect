import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ApiService } from '../../services/api';
import { Animal, Rol, Usuario } from '../../models/types';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css',
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  animales: Animal[] = [];
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'ADOPTANTE' as Rol,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.recargar();
  }

  recargar(): void {
    this.apiService.getUsuarios().subscribe((usuarios) => (this.usuarios = usuarios));
    this.apiService.getAnimales().subscribe((animales) => (this.animales = animales));
  }

  crearUsuario(): void {
    this.apiService.crearUsuario(this.nuevoUsuario).subscribe(() => {
      this.nuevoUsuario = { nombre: '', email: '', password: '', rol: 'ADOPTANTE' };
      this.recargar();
    });
  }

  borrarUsuario(id: number): void {
    this.apiService.borrarUsuario(id).subscribe(() => this.recargar());
  }

  borrarAnimal(id: number): void {
    this.apiService.borrarAnimal(id).subscribe(() => this.recargar());
  }
}
