import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // --- 🔐 RUTAS DE AUTENTICACIÓN (NO REQUIEREN GUARD) ---
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.authRoutes),
  },

  // --- 🏠 LAYOUT PRINCIPAL PROTEGIDO ---
  {
    path: '',
    loadComponent: () =>
      import('./layout').then((m) => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      // --- RUTAS DEL TEMPLATE BASE ---
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/routes').then((m) => m.routes),
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/routes').then((m) => m.routes),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/routes').then((m) => m.routes),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/routes').then((m) => m.routes),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/routes').then((m) => m.routes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/routes').then((m) => m.routes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/routes').then((m) => m.routes),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/routes').then((m) => m.routes),
      },

      // --- 🔹 CRUDS PERSONALIZADOS ---
      {
        path: 'clientes',
        loadComponent: () =>
          import('./modules/clientes/clientes.component').then(
            (m) => m.ClientesComponent
          ),
        data: { title: 'Clientes' },
      },
      {
        path: 'empleados',
        loadComponent: () =>
          import('./modules/empleados/empleados.component').then(
            (m) => m.EmpleadosComponent
          ),
        data: { title: 'Empleados' },
      },
      {
        path: 'autos',
        loadComponent: () =>
          import('./modules/autos/autos.component').then(
            (m) => m.AutosComponent
          ),
        data: { title: 'Autos' },
      },
      {
        path: 'concesionario',
        loadComponent: () =>
          import('./modules/concesionarios/concesionarios.component').then(
            (m) => m.ConcesionariosComponent
          ),
        data: { title: 'Concesionario' },
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import('./modules/facturas/facturas.component').then(
            (m) => m.FacturasComponent
          ),
        data: { title: 'Facturas' },
      },
      {
        path: 'mantenimientos',
        loadComponent: () =>
          import('./modules/mantenimientos/mantenimientos.component').then(
            (m) => m.MantenimientosComponent
          ),
        data: { title: 'Mantenimientos' },
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./modules/admin/admin.component').then(
            (m) => m.AdminComponent
          ),
        data: { title: 'Administradores' },
      },
    ],
  },

  // --- ⚠️ PÁGINAS DE ERROR ---
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: { title: 'Page 404' },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: { title: 'Page 500' },
  },

  // --- 🚀 Redirección por defecto ---
  { path: '**', redirectTo: 'auth/login' },
];
