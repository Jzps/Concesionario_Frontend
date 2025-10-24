import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// Asegurar que estos módulos estén importados para que el HTML funcione
import { RouterLink, RouterModule } from '@angular/router';
import { BadgeModule, ButtonModule, CardModule, GridModule } from '@coreui/angular';

// Definición de la interfaz para las tarjetas de módulo
interface ModuleCard {
  title: string;
  description: string;
  icon: string; // Clase de Font Awesome (ej: 'fas fa-car-side')
  link: string;
  color: string; // Color de Bootstrap: primary, info, warning, success, danger, dark, purple, etc.
  apiEndpoints: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, GridModule, ButtonModule, BadgeModule, RouterLink, RouterModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  moduleCards: ModuleCard[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initializeModuleCards();
  }

  // Inicializa la data del dashboard con colores e íconos temáticos variados
  initializeModuleCards(): void {
    this.moduleCards = [
      {
        title: 'Gestión de Autos',
        description: 'Administración completa del inventario (Nuevos, Usados, Eléctricos). Incluye registro, venta y listado de autos.',
        icon: 'fas fa-car-side', // 🚗 Carro
        link: '/autos',
        color: 'primary', // Azul
        apiEndpoints: ['POST /autos', 'GET /autos', 'PUT /autos/{id}', 'DELETE /autos/{id}']
      },
      {
        title: 'Clientes',
        description: 'Módulo CRUD para la gestión de la cartera de clientes. Fundamental para registrar compradores y facturación.',
        icon: 'fas fa-user-friends', // 👤 Personas
        link: '/clientes',
        color: 'info', // Cian/Claro (similar al sidebar)
        apiEndpoints: ['POST /clientes', 'GET /clientes', 'PUT /clientes/{id}', 'DELETE /clientes/{id}']
      },
      {
        title: 'Empleados',
        description: 'Control de personal (Vendedores y Técnicos). Permite asignar roles y especialidades para los mantenimientos.',
        icon: 'fas fa-id-badge', // 👨‍💼 Empleado
        link: '/empleados',
        color: 'warning', // Amarillo
        apiEndpoints: ['GET /empleados', 'POST /empleados/vendedores', 'POST /empleados/tecnicos']
      },
      {
        title: 'Facturas y Ventas',
        description: 'Seguimiento de las facturas generadas automáticamente tras cada venta. Reportes financieros y listados históricos.',
        icon: 'fas fa-file-invoice-dollar', // 🧾 Factura
        link: '/facturas',
        color: 'success', // Verde
        apiEndpoints: ['GET /facturas', 'POST /facturas (auto-generada)', 'DELETE /facturas/{id}']
      },
      {
        title: 'Mantenimientos',
        description: 'Registro de servicios de reparación, asignación de técnicos, y detalle de costos. Control de estado (Iniciado, Progreso, Finalizado).',
        icon: 'fas fa-tools', // 🛠️ Herramientas
        link: '/mantenimientos',
        color: 'danger', // Rojo
        apiEndpoints: ['POST /mantenimientos', 'GET /mantenimientos', 'PUT /mantenimientos/{id}']
      },
      {
        title: 'Concesionario (Sede)',
        description: 'Administración de la información principal de la sede. Permite actualizar los datos de contacto y detalles de la empresa.',
        icon: 'fas fa-building', // 🏢 Edificio
        link: '/concesionario',
        color: 'secondary', // Gris
        apiEndpoints: ['GET /concesionario', 'PUT /concesionario']
      },
      {
        title: 'Administración del Sistema',
        description: 'Módulo de seguridad y acceso: Login para validar credenciales y gestión de usuarios administradores del sistema (Módulo /admin).',
        icon: 'fas fa-user-shield', // 🔒 Admin
        link: '/admin',
        color: 'dark', // Negro
        apiEndpoints: ['POST /admin/login', 'POST /admin/register', 'DELETE /admin/{id}']
      },
      {
        title: 'Documentación (Swagger UI)',
        description: 'Acceso directo a la documentación interactiva de la API, esencial para pruebas y desarrollo. ¡Ver todas las rutas y modelos!',
        icon: 'fas fa-book', // 📚 Documentación
        link: '/swagger-ui',
        color: 'purple', // Morado
        apiEndpoints: ['API Docs Link']
      }
    ];
  }

  // Función para redirigir a Swagger UI
  goToSwagger(): void {
    // Abre la documentación de FastAPI en una nueva pestaña (ajusta el puerto si es necesario)
    window.open('http://localhost:8000/docs', '_blank'); 
  }
}