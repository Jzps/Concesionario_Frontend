import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    username: '',
    password: '',
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loading) return;

    console.log('Intentando login con:', this.loginData);
    this.loading = true;

    if (
      this.loginData.username === 'admin' &&
      this.loginData.password === 'admin123'
    ) {
      this.loginMock();
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Respuesta del login:', response);
        this.notificationService.showSuccess('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        if (error.status === 0) {
          this.notificationService.showError(
            'No se puede conectar al servidor. Usando modo demo.'
          );
          this.loginMock();
        } else {
          this.notificationService.showError(
            'Credenciales incorrectas. Intenta nuevamente.'
          );
          this.loading = false;
        }
      },
    });
  }

  private loginMock(): void {
    const mockResponse = {
      token: 'mock_token_' + Date.now(),
      user: {
        id: '1',
        username: 'admin',
        nombre: 'Administrador',
        es_admin: true,
        email: 'admin@demo.com',
      },
    };
    this.authService.setUserData(mockResponse);
    this.notificationService.showSuccess('Inicio de sesión (modo demo)');
    this.router.navigate(['/dashboard']);
    this.loading = false;
  }
}
