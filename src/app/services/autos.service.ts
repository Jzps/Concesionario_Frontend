import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  private readonly endpoint = '/autos';

  constructor(private apiService: ApiService) {}

  listarAutos(): Observable<Auto[]> {
    return this.apiService.get<Auto[]>(this.endpoint);
  }

  listarAutosVendidos(): Observable<Auto[]> {
    return this.apiService.get<Auto[]>(`${this.endpoint}/vendidos`);
  }

  venderAuto(id: string): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/vender/${id}`, {});
  }

  eliminarAuto(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  actualizarAuto(id: string, auto: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, auto);
  }

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
