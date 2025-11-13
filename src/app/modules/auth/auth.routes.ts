import { Routes } from '@angular/router';

// Rutas del módulo de autenticación
export const authRoutes: Routes = [
  {
    // Redirección por defecto hacia la página de login
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    // Ruta para el componente de inicio de sesión
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Ruta para el componente de registro
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    // Ruta para el componente de recuperación de contraseña
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
];
