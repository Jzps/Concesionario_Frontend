import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de una factura
export interface Factura {
  id?: string;
  fecha_emision: string;
  cliente_id: string;
  empleado_id: string;
  auto_id: string;
  precio_carro_base: number;
  costo_mantenimiento: number;
  descuento: number;
  total: number;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  // Endpoint base para las operaciones relacionadas con facturas
  private readonly endpoint = '/facturas';

  constructor(private apiService: ApiService) {}

  // Crea una nueva factura en el sistema
  crearFactura(data: Factura): Observable<Factura> {
    return this.apiService.post<Factura>(this.endpoint, data);
  }

  // Obtiene la lista de todas las facturas registradas
  listarFacturas(): Observable<Factura[]> {
    return this.apiService.get<Factura[]>(this.endpoint);
  }

  // Obtiene una factura específica por su ID
  obtenerFacturaPorId(id: string): Observable<Factura> {
    return this.apiService.get<Factura>(`${this.endpoint}/${id}`);
  }

  // Elimina una factura del sistema según su ID
  eliminarFactura(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
