import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ApiService } from '../../services/api';
import { Usuario } from '../../models/types';

@Component({
  selector: 'app-refugios',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './refugios.html',
  styleUrl: './refugios.css',
})
export class RefugiosComponent implements OnInit {
  refugios: Usuario[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRefugios().subscribe({
      next: (refugios) => (this.refugios = refugios),
    });
  }
}
