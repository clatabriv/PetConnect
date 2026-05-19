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

  resize(url: string | undefined | null, width: number, height: number): string {
    if (!url?.includes('res.cloudinary.com')) return url ?? '';
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
  }
}
