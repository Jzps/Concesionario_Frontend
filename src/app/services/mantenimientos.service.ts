import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de un mantenimiento
export interface Mantenimiento {
  id?: string;
  detalle: string;
  fecha: string;
  costo: number;
  empleado_id: string;
  auto_id: string;
  cliente_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  // Endpoint base para las operaciones relacionadas con mantenimientos
  private readonly endpoint = '/mantenimientos';

  constructor(private apiService: ApiService) {}

  // Crea un nuevo registro de mantenimiento
  crearMantenimiento(data: Mantenimiento): Observable<Mantenimiento> {
    return this.apiService.post<Mantenimiento>(this.endpoint, data);
  }

  // Obtiene la lista de todos los mantenimientos registrados
  listarMantenimientos(): Observable<Mantenimiento[]> {
    return this.apiService.get<Mantenimiento[]>(this.endpoint);
  }

  // Obtiene un mantenimiento específico por su ID
  obtenerMantenimientoPorId(id: string): Observable<Mantenimiento> {
    return this.apiService.get<Mantenimiento>(`${this.endpoint}/${id}`);
  }

  // Elimina un mantenimiento del sistema según su ID
  eliminarMantenimiento(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
