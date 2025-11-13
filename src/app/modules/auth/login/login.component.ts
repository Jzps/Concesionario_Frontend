import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Datos para el formulario de inicio de sesión
  loginData: LoginRequest = { username: '', password: '' };
  // Datos para el formulario de registro
  registerData = { username: '', password: '' };
  loading = false;
  modalMessage = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Inicia sesión con los datos ingresados
  onSubmit(): void {
    if (this.loading) return;
    this.loading = true;

    console.log('Intentando login con:', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Respuesta del login:', response);
        this.notificationService.showSuccess('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.loading = false;

        // Mostrar mensajes específicos según el tipo de error
        if (error.status === 404 || error.status === 422) {
          this.modalMessage = 'Usuario o contraseña incorrecta.';
        } else if (error.status === 0) {
          this.modalMessage = 'No se puede conectar al servidor.';
        } else {
          this.modalMessage = 'Error inesperado. Intenta nuevamente.';
        }

        this.openModal('errorModal');
      },
    });
  }

  // Abre un modal de Bootstrap por ID
  openModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Abre el modal de registro
  openRegisterModal(): void {
    this.openModal('registerModal');
  }

  // Envía los datos del formulario de registro
  onRegisterSubmit(): void {
    if (this.loading) return;
    this.loading = true;

    console.log('Registrando admin:', this.registerData);

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Admin registrado:', response);
        this.loading = false;
        this.notificationService.showSuccess(
          'Administrador registrado con éxito'
        );

        // Cierra el modal de registro
        const modalEl = document.getElementById('registerModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
      },
      error: (error) => {
        console.error('Error al registrar admin:', error);
        this.loading = false;
        this.notificationService.showError('Error al registrar admin');
      },
    });
  }
}
