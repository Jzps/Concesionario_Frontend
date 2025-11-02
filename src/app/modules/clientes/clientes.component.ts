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
      email: ['', [Validators.required, Validators.email]],
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
        console.log('Clientes cargados:', data);
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
        cliente.email.toLowerCase().includes(term)
    );
  }

  crearCliente() {
    this.clienteForm.reset();
  }

  guardarCliente() {
    if (this.clienteForm.valid) {
      const nuevoCliente: Cliente = {
        nombre: this.clienteForm.value.nombre,
        apellido: this.clienteForm.value.apellido,
        email: this.clienteForm.value.email,
        telefono: this.clienteForm.value.telefono,
        direccion: this.clienteForm.value.direccion,
      };

      this.clientesService.crearCliente(nuevoCliente).subscribe({
        next: (response) => {
          this.showMessageModal('Cliente creado exitosamente.');
          console.log('Cliente creado:', response);
          this.cargarClientes();
          this.clienteForm.reset();
        },
        error: (err) => {
          console.error('Error al crear cliente:', err);
          this.showMessageModal('Error al crear el cliente.');
        },
      });
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }

  editarCliente(id: string) {
    const cliente = this.clientes.find((c) => c.id === id);
    if (!cliente) return;

    this.clienteForm.patchValue(cliente);
    this.clienteIdToDelete = id;
  }

  actualizarCliente() {
    if (this.clienteForm.valid && this.clienteIdToDelete) {
      const clienteActualizado: Cliente = {
        nombre: this.clienteForm.value.nombre,
        apellido: this.clienteForm.value.apellido,
        email: this.clienteForm.value.email,
        telefono: this.clienteForm.value.telefono,
        direccion: this.clienteForm.value.direccion,
      };

      this.clientesService
        .actualizarCliente(this.clienteIdToDelete, clienteActualizado)
        .subscribe({
          next: () => {
            this.showMessageModal('Cliente actualizado exitosamente.');
            this.cargarClientes();
            this.clienteForm.reset();
            this.clienteIdToDelete = null;
          },
          error: (err) => {
            console.error('Error al actualizar cliente:', err);
            this.showMessageModal('Error al actualizar el cliente.');
          },
        });
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }

  eliminarCliente(id: string) {
    this.clienteIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.clienteIdToDelete) {
      this.clientesService.eliminarCliente(this.clienteIdToDelete).subscribe({
        next: () => {
          this.showMessageModal(
            `Cliente con ID ${this.clienteIdToDelete} eliminado.`
          );
          this.cargarClientes();
          this.clienteIdToDelete = null;
        },
        error: (err) => {
          console.error('Error al eliminar cliente:', err);
          this.showMessageModal('Error al eliminar el cliente.');
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
