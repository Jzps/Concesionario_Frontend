import { CommonModule, DatePipe } from '@angular/common'; // Importamos DatePipe para el HTML
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Nueva Interfaz de Datos
interface Admin { // Interfaz renombrada a 'Admin' para consistencia
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  fechaCreacion: string;
}

@Component({
  // Selector corregido a 'app-admin'
  selector: 'app-admin', 
  standalone: true,
  // Agregamos DatePipe a imports si se usa en el HTML
  imports: [CommonModule, FormsModule, DatePipe], 
  // La ruta del template asumo que es './admin.component.html'
  templateUrl: './admin.component.html',
  // Reutilizamos el estilo de tabla/contenedor
  styleUrls: ['../clientes/clientes.component.scss'] 
})
// Clase renombrada a 'AdminComponent'
export class AdminComponent { 
  filtro = '';

  // Datos de prueba (Simulando la respuesta del GET /admin - Listar)
  // El nombre de la variable 'administradores' puede mantenerse, o renombrarse a 'admins'
  admins: Admin[] = [
    {
      id: 'AD1',
      nombre: 'Marco',
      apellido: 'Velez',
      email: 'marco.admin@empresa.com',
      rol: 'SuperAdmin',
      fechaCreacion: '2024-01-15',
    },
    {
      id: 'AD2',
      nombre: 'Luisa',
      apellido: 'Giraldo',
      email: 'luisa.g@empresa.com',
      rol: 'Administrador',
      fechaCreacion: '2024-03-01',
    },
  ];

  // Funciones Mapeadas a los Métodos HTTP
  buscar() { // Mapea a GET /admin/{admin_id}
    console.log('Buscando administrador:', this.filtro);
  }

  crearAdmin() { // Mapea a POST /admin/Crear Admin
    alert('Función crear nuevo administrador');
  }

  eliminarAdmin(id: string) { // Mapea a DELETE /admin/{admin_id}
    const confirmar = confirm('¿Seguro que deseas eliminar este administrador?');
    if (confirmar) {
      this.admins = this.admins.filter(a => a.id !== id);
    }
  }
}