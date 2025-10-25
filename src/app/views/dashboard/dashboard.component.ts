import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  BadgeModule,
  ButtonModule,
  CardModule,
  GridModule,
} from '@coreui/angular';

interface ModuleCard {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  apiEndpoints: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    GridModule,
    ButtonModule,
    BadgeModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  moduleCards: ModuleCard[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initializeModuleCards();
  }

  initializeModuleCards(): void {
    this.moduleCards = [
      {
        title: 'Gestión de Autos',
        description:
          'Administración completa del inventario (Nuevos, Usados, Eléctricos). Incluye registro, venta y listado de autos.',
        icon: 'fas fa-car-side',
        link: '/autos',
        color: 'primary',
        apiEndpoints: [
          'POST /autos',
          'GET /autos',
          'PUT /autos/{id}',
          'DELETE /autos/{id}',
        ],
      },
      {
        title: 'Clientes',
        description:
          'Módulo CRUD para la gestión de la cartera de clientes. Fundamental para registrar compradores y facturación.',
        icon: 'fas fa-user-friends',
        link: '/clientes',
        color: 'info',
        apiEndpoints: [
          'POST /clientes',
          'GET /clientes',
          'PUT /clientes/{id}',
          'DELETE /clientes/{id}',
        ],
      },
      {
        title: 'Empleados',
        description:
          'Control de personal (Vendedores y Técnicos). Permite asignar roles y especialidades para los mantenimientos.',
        icon: 'fas fa-id-badge',
        link: '/empleados',
        color: 'warning',
        apiEndpoints: [
          'GET /empleados',
          'POST /empleados/vendedores',
          'POST /empleados/tecnicos',
        ],
      },
      {
        title: 'Facturas y Ventas',
        description:
          'Seguimiento de las facturas generadas automáticamente tras cada venta. Reportes financieros y listados históricos.',
        icon: 'fas fa-file-invoice-dollar',
        link: '/facturas',
        color: 'success',
        apiEndpoints: [
          'GET /facturas',
          'POST /facturas (auto-generada)',
          'DELETE /facturas/{id}',
        ],
      },
      {
        title: 'Mantenimientos',
        description:
          'Registro de servicios de reparación, asignación de técnicos, y detalle de costos. Control de estado (Iniciado, Progreso, Finalizado).',
        icon: 'fas fa-tools',
        link: '/mantenimientos',
        color: 'danger',
        apiEndpoints: [
          'POST /mantenimientos',
          'GET /mantenimientos',
          'PUT /mantenimientos/{id}',
        ],
      },
      {
        title: 'Concesionario (Sede)',
        description:
          'Administración de la información principal de la sede. Permite actualizar los datos de contacto y detalles de la empresa.',
        icon: 'fas fa-building',
        link: '/concesionario',
        color: 'secondary',
        apiEndpoints: ['GET /concesionario', 'PUT /concesionario'],
      },
      {
        title: 'Administración del Sistema',
        description:
          'Módulo de seguridad y acceso: Login para validar credenciales y gestión de usuarios administradores del sistema (Módulo /admin).',
        icon: 'fas fa-user-shield',
        link: '/admin',
        color: 'dark',
        apiEndpoints: [
          'POST /admin/login',
          'POST /admin/register',
          'DELETE /admin/{id}',
        ],
      },
      {
        title: 'Documentación (Swagger UI)',
        description:
          'Acceso directo a la documentación interactiva de la API, esencial para pruebas y desarrollo. ¡Ver todas las rutas y modelos!',
        icon: 'fas fa-book',
        link: '/swagger-ui',
        color: 'purple',
        apiEndpoints: ['API Docs Link'],
      },
    ];
  }

  goToSwagger(): void {
    window.open('http://localhost:8000/docs', '_blank');
  }
}
