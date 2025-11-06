import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Cliente, ClientesService } from '../../services/clientes.service';

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

  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['', [Validators.required]],
    });

    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filteredClientes = [...this.clientes];
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.showMessageModal('Error al cargar los clientes desde la API.');
      },
    });
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
        (cliente.correo && cliente.correo.toLowerCase().includes(term)) ||
        (cliente.dni && cliente.dni.includes(term))
    );
  }

  crearCliente() {
    this.clienteForm.reset();
  }

  guardarCliente() {
    if (this.clienteForm.valid) {
      const nuevoCliente: Cliente = { ...this.clienteForm.value };

      this.clientesService.crearCliente(nuevoCliente).subscribe({
        next: () => {
          this.showMessageModal('Cliente creado exitosamente.');
          this.cargarClientes();
          this.clienteForm.reset();
        },
        error: (err) => {
          console.error('Error al crear cliente:', err);
          this.showMessageModal('Error al crear cliente.');
        },
      });
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
      this.clientesService.eliminarCliente(this.clienteIdToDelete).subscribe({
        next: () => {
          this.showMessageModal('Cliente eliminado correctamente.');
          this.cargarClientes();
          this.clienteIdToDelete = null;
        },
        error: (err) => {
          console.error('Error al eliminar cliente:', err);
          this.showMessageModal('Error al eliminar cliente.');
        },
      });
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
