import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  private readonly endpoint = '/facturas';

  constructor(private apiService: ApiService) {}

  crearFactura(data: Factura): Observable<Factura> {
    return this.apiService.post<Factura>(this.endpoint, data);
  }

  listarFacturas(): Observable<Factura[]> {
    return this.apiService.get<Factura[]>(this.endpoint);
  }

  obtenerFacturaPorId(id: string): Observable<Factura> {
    return this.apiService.get<Factura>(`${this.endpoint}/${id}`);
  }

  eliminarFactura(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
