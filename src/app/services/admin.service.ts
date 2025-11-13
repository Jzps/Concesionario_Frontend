import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de un administrador
export interface Admin {
  id?: string;
  nombre: string;
  username: string;
  password?: string;
  email?: string;
  rol?: string;
  fechaCreacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // Endpoint base para las operaciones de administrador
  private readonly endpoint = '/admin';

  constructor(private apiService: ApiService) {}

  // Crea un nuevo administrador en el sistema
  crearAdmin(data: Admin): Observable<Admin> {
    return this.apiService.post<Admin>(this.endpoint, data);
  }

  // Inicia sesión de administrador con usuario y contraseña
  login(username: string, password: string): Observable<any> {
    const params = { username, password };
    return this.apiService.post<any>(`${this.endpoint}/login`, params);
  }

  // Obtiene la lista completa de administradores registrados
  listarAdmins(): Observable<Admin[]> {
    return this.apiService.get<Admin[]>(this.endpoint);
  }

  // Obtiene un administrador específico por su ID
  obtenerAdminPorId(id: string): Observable<Admin> {
    return this.apiService.get<Admin>(`${this.endpoint}/${id}`);
  }

  // Elimina un administrador por su ID
  eliminarAdmin(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
