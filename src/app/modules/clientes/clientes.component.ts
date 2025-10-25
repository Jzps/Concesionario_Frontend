import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  filtro = '';
  clienteForm!: FormGroup;
  messageModalText: string = '';

  clienteIdToDelete: string | null = null;

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
      telefono: '3108901234',
      direccion: 'Av. 15 #60-12',
    },
    {
      id: '3',
      nombre: 'Mariana',
      apellido: 'Gutierrez',
      dni: '1265894637',
      correo: 'maria@correo.com',
      telefono: '3265971684',
      direccion: 'CR 59 90-77',
    },
  ];

  filteredClientes: Cliente[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],

      dni: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      correo: ['', [Validators.required, Validators.email]],

      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['', [Validators.required]],
    });

    this.filteredClientes = [...this.clientes];
  }

  filtrarClientes() {
    const term = this.filtro.toLowerCase().trim();
    if (!term) {
      this.filteredClientes = [...this.clientes];
      return;
    }

    this.filteredClientes = this.clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(term) ||
        cliente.apellido.toLowerCase().includes(term) ||
        cliente.dni.includes(term)
    );
  }

  /**
  
    @returns
   */
  private getNextId(): string {
    const maxId = this.clientes.reduce((max, cliente) => {
      const currentId = parseInt(cliente.id, 10);
      return isNaN(currentId) ? max : Math.max(max, currentId);
    }, 0);

    return (maxId + 1).toString();
  }

  crearCliente() {
    this.clienteForm.reset();
  }

  guardarCliente() {
    if (this.clienteForm.valid) {
      const nuevoCliente: Cliente = {
        id: this.getNextId(),
        ...this.clienteForm.value,
      };

      this.clientes.push(nuevoCliente);

      this.filtrarClientes();

      this.showMessageModal('Cliente creado exitosamente.');

      this.clienteForm.reset();
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }

  editarCliente(id: string) {
    this.showMessageModal(
      `Función de edición pendiente para el cliente con ID: ${id}`
    );
  }

  eliminarCliente(id: string) {
    this.clienteIdToDelete = id;

    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.clienteIdToDelete) {
      this.clientes = this.clientes.filter(
        (c) => c.id !== this.clienteIdToDelete
      );
      this.filtrarClientes();
      this.showMessageModal(
        `Cliente con ID ${this.clienteIdToDelete} eliminado.`
      );
      this.clienteIdToDelete = null;
    }
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;

    console.log(`[Message Modal] ${message}`);
  }

  private showConfirmModal(): void {
    console.log(
      `[Confirm Modal] Solicitud de eliminación para ${this.clienteIdToDelete}`
    );
  }
}
