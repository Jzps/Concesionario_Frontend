import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Empleado {
  id?: string;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  cargo?: string;
  salario?: number;
  fecha_contratacion?: string;
}

export interface Vendedor {
  empleado_id: string;
}

export interface Tecnico {
  empleado_id: string;
  especialidad?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private readonly endpoint = '/empleados';

  constructor(private apiService: ApiService) {}

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.apiService.post<Empleado>(this.endpoint, empleado);
  }

  listarEmpleados(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>(this.endpoint);
  }

  obtenerEmpleadoPorId(id: string): Observable<Empleado> {
    return this.apiService.get<Empleado>(`${this.endpoint}/${id}`);
  }

  actualizarEmpleado(id: string, empleado: Empleado): Observable<Empleado> {
    return this.apiService.put<Empleado>(`${this.endpoint}/${id}`, empleado);
  }

  eliminarEmpleado(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  registrarVendedor(vendedor: Vendedor): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/vendedores`, vendedor);
  }

  registrarTecnico(tecnico: Tecnico): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/tecnicos`, tecnico);
  }

  listarVendedores(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>(`${this.endpoint}/vendedores`);
  }

  listarTecnicos(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>(`${this.endpoint}/tecnicos`);
  }
}
