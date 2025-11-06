import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Cliente {
  id?: string;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly endpoint = '/clientes';

  constructor(private apiService: ApiService) {}

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

  listarClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(this.endpoint);
  }

  obtenerClientePorId(id: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id}`);
  }

  actualizarCliente(id: string, cliente: Cliente): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  eliminarCliente(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
