import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // URL base de la API obtenida del archivo de entorno
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Realiza una petición GET con parámetros opcionales
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      params: httpParams,
    });
  }

  // Realiza una petición POST con datos y parámetros opcionales
  post<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { params });
  }

  // Realiza una petición PUT para actualizar recursos
  put<T>(endpoint: string, data: any): Observable<T> {
    console.log('PUT →', `${this.baseUrl}${endpoint}`, data);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // Realiza una petición PATCH para actualizar parcialmente recursos
  patch<T>(endpoint: string, data: any): Observable<T> {
    console.log('PATCH →', `${this.baseUrl}${endpoint}`, data);
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // Realiza una petición DELETE para eliminar recursos
  delete<T>(endpoint: string): Observable<T> {
    console.log('DELETE →', `${this.baseUrl}${endpoint}`);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
