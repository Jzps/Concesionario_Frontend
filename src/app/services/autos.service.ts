import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Auto {
  id?: string;
  marca: string;
  modelo: string;
  precio: number;
  kilometraje?: number | null;
  autonomia?: number | null;
  tipo: 'nuevo' | 'usado' | 'electrico';
  estado?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutosService {
  private readonly endpoint = '/autos';

  constructor(private apiService: ApiService) {}

  listarAutos(): Observable<Auto[]> {
    return this.apiService.get<Auto[]>(this.endpoint);
  }

  obtenerAutoPorId(id: string): Observable<Auto> {
    return this.apiService.get<Auto>(`${this.endpoint}/${id}`);
  }

  comprarAuto(
    tipo: string,
    marca: string,
    modelo: string,
    precio: number,
    kilometraje?: number | null,
    autonomia?: number | null
  ): Observable<any> {
    const params: any = { tipo, marca, modelo, precio };
    if (kilometraje !== undefined && kilometraje !== null)
      params.kilometraje = kilometraje;
    if (autonomia !== undefined && autonomia !== null)
      params.autonomia = autonomia;

    return this.apiService.post<any>(`${this.endpoint}/comprar`, params);
  }

  venderAuto(id: string): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/vender/${id}`, {});
  }

  listarAutosVendidos(): Observable<Auto[]> {
    return this.apiService.get<Auto[]>(`${this.endpoint}/vendidos`);
  }

  actualizarAuto(id: string, auto: Auto): Observable<Auto> {
    return this.apiService.put<Auto>(`${this.endpoint}/${id}`, auto);
  }

  eliminarAuto(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
