import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class RegisterComponent implements OnInit {
  registerData = {
    username: '',
    password: '',
    nombre: '',
    email: '',
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
    this.loading = true;

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Usuario registrado con éxito');
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.notificationService.showError(
          'Error al registrar. Intenta nuevamente.'
        );
        this.loading = false;
      },
    });
  }
}
