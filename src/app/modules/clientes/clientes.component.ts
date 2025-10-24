import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  direccion: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent {
  filtro = '';

  clientes: Cliente[] = [
    {
      id: '1',
      nombre: 'Javier',
      apellido: 'Castro',
      dni: '1101234567',
      correo: 'Castro@gmail.com',
      telefono: '3149988776',
      direccion: 'Calle 30 #90-11',
    },
    {
      id: '2',
      nombre: 'Andres',
      apellido: 'Lopez',
      dni: '1089012345',
      correo: 'Andres@gmail.com',
      telefono: '1089012345',
      direccion: 'Av. 15 #60-12',
    },
    {
      id: '3',
      nombre: 'Mariana',
      apellido: 'Gutierrez',
      dni: '1265894637',
      correo: 'maria@correo.com',
      telefono: '32659716842',
      direccion: 'CR 59 90-77',
    }
  ];

  buscar() {
    console.log('Buscando:', this.filtro);
  }

  crearCliente() {
    alert('Función crear cliente');
  }

  editarCliente(id: string) {
    alert(`Editar cliente con ID: ${id}`);
  }

  eliminarCliente(id: string) {
    const confirmar = confirm('¿Seguro que deseas eliminar este cliente?');
    if (confirmar) {
      this.clientes = this.clientes.filter(c => c.id !== id);
    }
  }
}
