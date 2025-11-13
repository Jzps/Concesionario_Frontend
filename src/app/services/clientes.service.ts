import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de un cliente
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
  // Endpoint base para las operaciones relacionadas con clientes
  private readonly endpoint = '/clientes';

  constructor(private apiService: ApiService) {}

  // Crea un nuevo cliente en la base de datos
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

  // Obtiene la lista de todos los clientes
  listarClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(this.endpoint);
  }

  // Obtiene los datos de un cliente específico por su ID
  obtenerClientePorId(id: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id}`);
  }

  // Actualiza los datos de un cliente existente
  actualizarCliente(id: string, cliente: Cliente): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  // Elimina un cliente por su ID
  eliminarCliente(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
