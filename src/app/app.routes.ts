import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: { title: 'Home' },
    children: [
      // --- RUTAS DEL TEMPLATE BASE ---
      { path: 'dashboard', loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes) },
      { path: 'theme', loadChildren: () => import('./views/theme/routes').then((m) => m.routes) },
      { path: 'base', loadChildren: () => import('./views/base/routes').then((m) => m.routes) },
      { path: 'buttons', loadChildren: () => import('./views/buttons/routes').then((m) => m.routes) },
      { path: 'forms', loadChildren: () => import('./views/forms/routes').then((m) => m.routes) },
      { path: 'icons', loadChildren: () => import('./views/icons/routes').then((m) => m.routes) },
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes) },
      { path: 'widgets', loadChildren: () => import('./views/widgets/routes').then((m) => m.routes) },
      { path: 'charts', loadChildren: () => import('./views/charts/routes').then((m) => m.routes) },
      { path: 'pages', loadChildren: () => import('./views/pages/routes').then((m) => m.routes) },

      // --- 🔹 RUTAS DE TUS CRUDS ---
      { path: 'clientes', loadComponent: () => import('./modules/clientes/clientes.component').then(m => m.ClientesComponent), data: { title: 'Clientes' } },
      { path: 'empleados', loadComponent: () => import('./modules/empleados/empleados.component').then(m => m.EmpleadosComponent), data: { title: 'Empleados' } },
      { path: 'autos', loadComponent: () => import('./modules/autos/autos.component').then(m => m.AutosComponent), data: { title: 'Autos' } },
      { path: 'concesionario', loadComponent: () => import('./modules/concesionarios/concesionarios.component').then(m => m.ConcesionariosComponent), data: { title: 'Concesionario' } },
      { path: 'facturas', loadComponent: () => import('./modules/facturas/facturas.component').then(m => m.FacturasComponent), data: { title: 'Facturas' } },
      { path: 'mantenimientos', loadComponent: () => import('./modules/mantenimientos/mantenimientos.component').then(m => m.MantenimientosComponent), data: { title: 'Mantenimientos' } },
      { path: 'admin', loadComponent: () => import('./modules/admin/admin.component').then(m => m.AdminComponent), data: { title: 'Administradores' } }
    ]
  },
  // --- PÁGINAS DE ERROR Y AUTENTICACIÓN ---
  { path: '404', loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component), data: { title: 'Page 404' } },
  { path: '500', loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component), data: { title: 'Page 500' } },
  { path: 'login', loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent), data: { title: 'Login Page' } },
  { path: 'register', loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent), data: { title: 'Register Page' } },
  { path: '**', redirectTo: 'dashboard' }
];
