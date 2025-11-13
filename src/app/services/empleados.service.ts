import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de un empleado
export interface Empleado {
  id?: string;
  empleado_id?: string;
  nombre?: string;
  nombre_empleado?: string;
  apellido?: string;
  apellido_empleado?: string;
  dni?: string;
  correo?: string;
  telefono?: string;
  cargo?: string;
  salario?: number;
  fecha_contratacion?: string;
  tipo_carro?: string;
}

// Interfaz para registrar un vendedor
export interface Vendedor {
  empleado_id: string;
}

// Interfaz para registrar un técnico
export interface Tecnico {
  empleado_id: string;
  especialidad?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  // Endpoint base para las operaciones relacionadas con empleados
  private readonly endpoint = '/empleados';

  constructor(private apiService: ApiService) {}

  // Crea un nuevo empleado
  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.apiService.post<Empleado>(this.endpoint, empleado);
  }

  // Obtiene la lista de todos los empleados
  listarEmpleados(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>(this.endpoint);
  }

  // Obtiene un empleado por su ID
  obtenerEmpleadoPorId(id: string): Observable<Empleado> {
    return this.apiService.get<Empleado>(`${this.endpoint}/${id}`);
  }

  // Actualiza los datos de un empleado existente
  actualizarEmpleado(id: string, empleado: Empleado): Observable<Empleado> {
    return this.apiService.put<Empleado>(`${this.endpoint}/${id}`, empleado);
  }

  // Elimina un empleado por su ID
  eliminarEmpleado(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  // Registra un empleado como vendedor
  registrarVendedor(vendedor: Vendedor): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/vendedores`, vendedor);
  }

  // Registra un empleado como técnico
  registrarTecnico(tecnico: Tecnico): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/tecnicos`, tecnico);
  }

  // Obtiene la lista de empleados con rol de vendedor
  listarVendedores(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>(`${this.endpoint}/vendedores`);
  }

  // Obtiene la lista de empleados con rol de técnico
  listarTecnicos(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>(`${this.endpoint}/tecnicos`);
  }
}
