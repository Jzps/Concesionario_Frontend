import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Gestión General'
  },
  {
    name: 'Clientes',
    url: '/clientes',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Empleados',
    url: '/empleados',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Autos',
    url: '/autos',
    iconComponent: { name: 'cil-car-alt' }
  },
  {
    name: 'Concesionario',
    url: '/concesionario',
    iconComponent: { name: 'cil-building' }
  },
  {
    name: 'Facturas',
    url: '/facturas',
    iconComponent: { name: 'cil-description' }
  },
  {
    name: 'Mantenimientos',
    url: '/mantenimientos',
    iconComponent: { name: 'cil-settings' }
  },
  {
    name: 'Administradores',
    url: '/admin',
    iconComponent: { name: 'cil-lock-locked' }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Páginas',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Documentación CoreUI',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
