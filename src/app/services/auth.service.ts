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
  username: string;
  email?: string;
  nombre?: string;
  es_admin?: boolean;
}

export interface LoginResponse {
  message?: string;
  token?: string;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
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
        console.log('Login response:', response);
        const user: User = {
          id: response.user?.id ?? 'temp_id',
          username: credentials.username,
          es_admin: true,
        };
        this.setUserData({
          token: response.token ?? 'token_' + Date.now(),
          user,
        });
      })
    );
  }

  register(data: { username: string; password: string }): Observable<any> {
    return this.apiService.post('/admin/', {
      username: data.username,
      password: data.password,
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
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

  private setUserData(data: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token ?? '');
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user ?? {}));
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
}
