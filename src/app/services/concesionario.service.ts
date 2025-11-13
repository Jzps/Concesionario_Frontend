import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de un concesionario
export interface Concesionario {
  id?: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConcesionarioService {
  // Endpoint base para las operaciones relacionadas con concesionarios
  private readonly endpoint = '/concesionario';

  constructor(private apiService: ApiService) {}

  // Obtiene la lista de todos los concesionarios
  listarConcesionarios(): Observable<Concesionario[]> {
    return this.apiService.get<Concesionario[]>(this.endpoint);
  }

  // Obtiene un concesionario por su ID
  obtenerConcesionarioPorId(id: string): Observable<Concesionario> {
    return this.apiService.get<Concesionario>(`${this.endpoint}/${id}`);
  }

  // Crea un nuevo concesionario
  crearConcesionario(data: Concesionario): Observable<Concesionario> {
    return this.apiService.post<Concesionario>(this.endpoint, data);
  }

  // Actualiza los datos de un concesionario existente
  actualizarConcesionario(
    id: string,
    data: Concesionario
  ): Observable<Concesionario> {
    return this.apiService.put<Concesionario>(`${this.endpoint}/${id}`, data);
  }

  // Elimina un concesionario por su ID
  eliminarConcesionario(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
