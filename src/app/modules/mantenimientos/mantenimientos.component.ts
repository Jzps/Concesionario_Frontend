import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Nueva Interfaz de Datos
interface Mantenimiento {
  id: string;
  autoPlaca: string;
  tecnico: string;
  fechaEntrada: string;
  costo: number;
  descripcion: string;
  estado: 'INICIADO' | 'EN_PROGRESO' | 'FINALIZADO';
}

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  // Necesitamos DatePipe y CurrencyPipe
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe], 
  templateUrl: './mantenimientos.component.html',
  // Reutilizamos el estilo de tabla/contenedor
  styleUrls: ['../clientes/clientes.component.scss'] 
})
export class MantenimientosComponent {
  filtro = '';

  // Datos de prueba (Simulando la respuesta del GET /mantenimientos - Listar)
  mantenimientos: Mantenimiento[] = [
    {
      id: 'M101',
      autoPlaca: 'XYZ123',
      tecnico: 'Sofía Rojas',
      fechaEntrada: '2025-10-01',
      costo: 350000,
      descripcion: 'Cambio de aceite y filtros',
      estado: 'FINALIZADO',
    },
    {
      id: 'M102',
      autoPlaca: 'ABC456',
      tecnico: 'Jorge Diaz',
      fechaEntrada: '2025-10-15',
      costo: 0,
      descripcion: 'Revisión de frenos',
      estado: 'EN_PROGRESO',
    },
    {
      id: 'M103',
      autoPlaca: 'KLM789',
      tecnico: 'Sofía Rojas',
      fechaEntrada: '2025-10-18',
      costo: 0,
      descripcion: 'Diagnóstico de motor',
      estado: 'INICIADO',
    },
  ];

  // Funciones Mapeadas a los Métodos HTTP
  buscar() { // Mapea a GET /mantenimientos/{mantenimiento_id}
    console.log('Buscando mantenimiento:', this.filtro);
  }

  crearMantenimiento() { // Mapea a POST /mantenimientos
    alert('Función crear nuevo mantenimiento');
  }

  eliminarMantenimiento(id: string) { // Mapea a DELETE /mantenimientos/{mantenimiento_id}
    const confirmar = confirm('¿Seguro que deseas eliminar este registro de mantenimiento?');
    if (confirmar) {
      this.mantenimientos = this.mantenimientos.filter(m => m.id !== id);
    }
  }

  // Función para obtener la clase de Bootstrap basada en el estado (reutilizada de Facturas)
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'FINALIZADO':
        return 'badge bg-success';
      case 'EN_PROGRESO':
        return 'badge bg-warning text-dark';
      case 'INICIADO':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }
}