import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Interfaz que define la estructura de un auto
export interface Auto {
  id?: string;
  marca: string;
  modelo: string;
  precio: number;
  tipo: string;
  kilometraje?: number | null;
  autonomia?: number | null;
  estado?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutosService {
  // Endpoint base para las operaciones relacionadas con autos
  private readonly endpoint = '/autos';

  constructor(private apiService: ApiService) {}

  // Obtiene la lista completa de autos disponibles
  listarAutos(): Observable<Auto[]> {
    return this.apiService.get<Auto[]>(this.endpoint);
  }

  // Obtiene la lista de autos que ya fueron vendidos
  listarAutosVendidos(): Observable<Auto[]> {
    return this.apiService.get<Auto[]>(`${this.endpoint}/vendidos`);
  }

  // Marca un auto como vendido por su ID
  venderAuto(id: string): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/vender/${id}`, {});
  }

  // Elimina un auto existente por su ID
  eliminarAuto(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  // Actualiza los datos de un auto específico
  actualizarAuto(id: string, auto: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, auto);
  }

  // Registra la compra de un nuevo auto con sus datos básicos
  comprarAuto(
    tipo: string,
    marca: string,
    modelo: string,
    precio: number,
    kilometraje?: number | null,
    autonomia?: number | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('marca', marca)
      .set('modelo', modelo)
      .set('precio', precio);

    if (kilometraje !== null && kilometraje !== undefined) {
      params = params.set('kilometraje', kilometraje);
    }

    if (autonomia !== null && autonomia !== undefined) {
      params = params.set('autonomia', autonomia);
    }

    return this.apiService.post<any>(`${this.endpoint}/comprar`, {}, params);
  }
}
