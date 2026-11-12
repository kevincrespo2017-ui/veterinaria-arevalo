import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RespuestaAsistente { respuesta: string; }

@Injectable({ providedIn: 'root' })
export class AsistenteServicio {
  private readonly http = inject(HttpClient);
  conversar(mensaje: string): Observable<RespuestaAsistente> {
    return this.http.post<RespuestaAsistente>(`${environment.apiUrl}/asistente/chat`, { mensaje })
      .pipe(timeout(50000));
  }
}
