import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly CLOUD_NAME = 'dv4woelyt';
  private readonly UPLOAD_PRESET = 'petconnect_uploads';
  private readonly URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

  constructor(private http: HttpClient) {}

  subirImagen(archivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', this.UPLOAD_PRESET);

    return this.http
      .post<{ secure_url: string }>(this.URL, formData)
      .pipe(map((res) => res.secure_url));
  }
}
