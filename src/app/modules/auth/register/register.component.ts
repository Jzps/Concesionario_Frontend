import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerData = {
    username: '',
    password: '',
  };
  loading = false;

  constructor(
    private auth: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;
    this.loading = true;

    this.auth.register(this.registerData).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        this.notification.showSuccess('Administrador creado correctamente');
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error registro:', err);
        this.notification.showError('Error al registrar usuario');
        this.loading = false;
      },
    });
  }
}
