import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Admin {
  id?: string;
  nombre: string;
  username: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly endpoint = '/admin';

  constructor(private apiService: ApiService) {}

  crearAdmin(data: Admin): Observable<Admin> {
    return this.apiService.post<Admin>(this.endpoint, data);
  }

  login(username: string, password: string): Observable<any> {
    const params = { username, password };
    return this.apiService.post<any>(`${this.endpoint}/login`, params);
  }

  listarAdmins(): Observable<Admin[]> {
    return this.apiService.get<Admin[]>(this.endpoint);
  }

  obtenerAdminPorId(id: string): Observable<Admin> {
    return this.apiService.get<Admin>(`${this.endpoint}/${id}`);
  }

  eliminarAdmin(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
