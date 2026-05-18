import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { CloudinaryService } from '../../services/cloudinary';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [NgIf],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUploadComponent {
  // URL actual de la imagen (para previsualizar la ya guardada)
  @Input() urlActual = '';
  // Emite la nueva URL cuando se sube con éxito
  @Output() imagenSubida = new EventEmitter<string>();

  subiendo = false;
  error = '';
  previsualizacion = '';

  constructor(private cloudinary: CloudinaryService) {}

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const archivo = input.files[0];

    // Validar tipo
    if (!archivo.type.startsWith('image/')) {
      this.error = 'Solo se permiten imágenes (JPG, PNG, WEBP...)';
      return;
    }

    // Validar tamaño (máx 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      this.error = 'La imagen no puede superar 5MB';
      return;
    }

    this.error = '';

    // Previsualizar antes de subir
    const reader = new FileReader();
    reader.onload = () => (this.previsualizacion = reader.result as string);
    reader.readAsDataURL(archivo);

    // Subir a Cloudinary
    this.subiendo = true;
    this.cloudinary.subirImagen(archivo).subscribe({
      next: (url) => {
        this.subiendo = false;
        this.urlActual = url;
        this.imagenSubida.emit(url);
      },
      error: () => {
        this.subiendo = false;
        this.previsualizacion = '';
        this.error = 'Error al subir la imagen. Inténtalo de nuevo.';
      },
    });
  }
}
