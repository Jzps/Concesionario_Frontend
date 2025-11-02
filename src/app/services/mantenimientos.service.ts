import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Mantenimiento {
  id?: string;
  descripcion: string;
  fecha: string;
  costo: number;
  empleado_id: string;
  auto_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  private readonly endpoint = '/mantenimientos';

  constructor(private apiService: ApiService) {}

  crearMantenimiento(data: Mantenimiento): Observable<Mantenimiento> {
    return this.apiService.post<Mantenimiento>(this.endpoint, data);
  }

  listarMantenimientos(): Observable<Mantenimiento[]> {
    return this.apiService.get<Mantenimiento[]>(this.endpoint);
  }

  obtenerMantenimientoPorId(id: string): Observable<Mantenimiento> {
    return this.apiService.get<Mantenimiento>(`${this.endpoint}/${id}`);
  }

  eliminarMantenimiento(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
