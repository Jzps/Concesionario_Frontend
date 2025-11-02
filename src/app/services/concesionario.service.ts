import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  private readonly endpoint = '/concesionario';

  constructor(private apiService: ApiService) {}

  listarConcesionarios(): Observable<Concesionario[]> {
    return this.apiService.get<Concesionario[]>(this.endpoint);
  }

  obtenerConcesionarioPorId(id: string): Observable<Concesionario> {
    return this.apiService.get<Concesionario>(`${this.endpoint}/${id}`);
  }

  crearConcesionario(data: Concesionario): Observable<Concesionario> {
    return this.apiService.post<Concesionario>(this.endpoint, data);
  }

  actualizarConcesionario(
    id: string,
    data: Concesionario
  ): Observable<Concesionario> {
    return this.apiService.put<Concesionario>(`${this.endpoint}/${id}`, data);
  }

  eliminarConcesionario(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
