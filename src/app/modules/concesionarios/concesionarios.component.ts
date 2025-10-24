import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Nueva Interfaz de Datos
interface Concesionario {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  ciudad: string;
}

@Component({
  selector: 'app-concesionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './concesionarios.component.html',
  // Reutilizamos el estilo de tabla/contenedor
  styleUrls: ['../clientes/clientes.component.scss'] 
})
export class ConcesionariosComponent {
  filtro = '';

  // Datos de prueba (Simulando la respuesta del GET /concesionario - Listar)
  concesionarios: Concesionario[] = [
    {
      id: 'C1',
      nombre: 'AutoCentro Principal',
      direccion: 'Av. Libertador #10-50',
      telefono: '6015551234',
      email: 'contacto@autocentro.com',
      ciudad: 'Bogotá',
    },
    {
      id: 'C2',
      nombre: 'Ruedas del Sur',
      direccion: 'Calle 25 #5-10',
      telefono: '6045555678',
      email: 'sur@ruedas.com',
      ciudad: 'Medellín',
    },
  ];

  // Funciones Mapeadas a los Métodos HTTP
  buscar() { // Mapea a GET /concesionario/{concesionario_id}
    console.log('Buscando concesionario:', this.filtro);
  }

  crearConcesionario() { // Mapea a POST /concesionario
    alert('Función crear concesionario');
  }

  editarConcesionario(id: string) { // Mapea a PUT /concesionario/{concesionario_id}
    alert(`Editar concesionario con ID: ${id}`);
  }

  eliminarConcesionario(id: string) { // Mapea a DELETE /concesionario/{concesionario_id}
    const confirmar = confirm('¿Seguro que deseas eliminar este concesionario?');
    if (confirmar) {
      this.concesionarios = this.concesionarios.filter(c => c.id !== id);
    }
  }
}