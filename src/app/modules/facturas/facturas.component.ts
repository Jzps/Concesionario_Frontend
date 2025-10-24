import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Nueva Interfaz de Datos
interface Factura {
  id: string;
  cliente: string;
  fecha: string; // Usaremos string para simplificar
  total: number;
  estado: 'PAGADA' | 'PENDIENTE' | 'ANULADA';
}

@Component({
  selector: 'app-facturas',
  standalone: true,
  // Necesitamos CurrencyPipe y DatePipe para formatear los datos en la tabla
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe], 
  templateUrl: './facturas.component.html',
  // Reutilizamos el estilo de tabla/contenedor
  styleUrls: ['../clientes/clientes.component.scss'] 
})
export class FacturasComponent {
  filtro = '';

  // Datos de prueba (Simulando la respuesta del GET /facturas - Listar)
  facturas: Factura[] = [
    {
      id: 'F001',
      cliente: 'Javier Castro',
      fecha: '2025-10-10',
      total: 1500000,
      estado: 'PAGADA',
    },
    {
      id: 'F002',
      cliente: 'Andres Lopez',
      fecha: '2025-10-15',
      total: 850000,
      estado: 'PENDIENTE',
    },
    {
      id: 'F003',
      cliente: 'Mariana Gutierrez',
      fecha: '2025-09-28',
      total: 2100000,
      estado: 'ANULADA',
    },
  ];

  // Funciones Mapeadas a los Métodos HTTP
  buscar() { // Mapea a GET /facturas/{factura_id}
    console.log('Buscando factura:', this.filtro);
  }

  crearFactura() { // Mapea a POST /facturas
    alert('Función crear nueva factura');
  }

  // Eliminamos editarFactura ya que no hay PUT
  
  eliminarFactura(id: string) { // Mapea a DELETE /facturas/{factura_id}
    const confirmar = confirm('¿Seguro que deseas eliminar esta factura? Las facturas suelen ser inmutables.');
    if (confirmar) {
      this.facturas = this.facturas.filter(f => f.id !== id);
    }
  }

  // Función para obtener la clase de Bootstrap basada en el estado
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PAGADA':
        return 'badge bg-success';
      case 'PENDIENTE':
        return 'badge bg-warning text-dark';
      case 'ANULADA':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}