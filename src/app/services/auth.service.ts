import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  email?: string;
  nombre?: string;
  username: string;
  telefono?: string;
  activo?: boolean;
  es_admin?: boolean;
  fecha_creacion?: string;
  fecha_edicion?: string;
}

export interface LoginResponse {
  message?: string;
  token?: string;
  user?: User;
}

export type UserRole = 'admin' | 'consumidor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly ROLE_KEY = 'user_role';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<any> {
    const params = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.apiService.post<any>('/admin/login', null, params).pipe(
      tap((response) => {
        const userData: User = {
          id: 'temp',
          username: credentials.username,
          es_admin: true,
        };
        this.setUserData({
          token: 'token_' + Date.now(),
          user: userData,
        });
      })
    );
  }

  register(data: {
    username: string;
    password: string;
    nombre?: string;
    email?: string;
  }): Observable<any> {
    return this.apiService.post('/admin/', data);
  }

  verificarEstado(): Observable<any> {
    return this.apiService.get('/admin/');
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setUserData(data: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token ?? 'mock_token');
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user ?? {}));
    localStorage.setItem(
      this.ROLE_KEY,
      data.user?.es_admin ? 'admin' : 'consumidor'
    );
    this.currentUserSubject.next(data.user ?? null);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.es_admin ? 'admin' : 'consumidor';
  }

  canAccess(route: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    if (role === 'admin') return true;
    if (role === 'consumidor') {
      return ['productos', 'dashboard'].includes(route);
    }

    return false;
  }
}
