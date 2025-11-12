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

declare var bootstrap: any;

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
  messageModalText = '';
  clienteIdToDelete: string | null = null;

  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];

  modoEdicion = false;
  clienteEditandoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['', Validators.required],
    });

    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filteredClientes = [...this.clientes];
      },
      error: () => {
        this.showMessageModal('Error al cargar los clientes.');
      },
    });
  }

  filtrarClientes() {
    const term = this.filtro.toLowerCase();
    this.filteredClientes = this.clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        c.apellido.toLowerCase().includes(term) ||
        c.correo.toLowerCase().includes(term) ||
        c.dni.includes(term)
    );
  }

  crearCliente() {
    this.modoEdicion = false;
    this.clienteForm.reset();

    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
  }

  guardarCliente() {
    if (!this.clienteForm.valid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    if (this.modoEdicion && this.clienteEditandoId) {
      this.clientesService
        .actualizarCliente(this.clienteEditandoId, this.clienteForm.value)
        .subscribe({
          next: () => {
            this.showMessageModal('Cliente actualizado correctamente.');
            this.cargarClientes();

            const modal = bootstrap.Modal.getInstance(
              document.getElementById('clienteModal')
            );
            modal.hide();
          },
          error: () => {
            this.showMessageModal('Error al actualizar cliente.');
          },
        });
      return;
    }

    this.clientesService.crearCliente(this.clienteForm.value).subscribe({
      next: () => {
        this.showMessageModal('Cliente creado exitosamente.');
        this.cargarClientes();

        const modal = bootstrap.Modal.getInstance(
          document.getElementById('clienteModal')
        );
        modal.hide();
      },
      error: () => {
        this.showMessageModal('Error al crear cliente.');
      },
    });
  }

  editarCliente(id: string) {
    this.modoEdicion = true;
    this.clienteEditandoId = id;

    // traemos el cliente completo
    this.clientesService.obtenerClientePorId(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue(cliente);

        const modal = new bootstrap.Modal(
          document.getElementById('clienteModal')
        );
        modal.show();
      },
      error: () => this.showMessageModal('Error al cargar datos del cliente.'),
    });
  }

  eliminarCliente(id: string) {
    this.clienteIdToDelete = id;

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
  }

  confirmarEliminar() {
    if (!this.clienteIdToDelete) return;

    this.clientesService.eliminarCliente(this.clienteIdToDelete).subscribe({
      next: () => {
        this.showMessageModal('Cliente eliminado correctamente.');
        this.cargarClientes();
      },
      error: () => {
        this.showMessageModal('Error al eliminar cliente.');
      },
    });
  }

  showMessageModal(message: string) {
    this.messageModalText = message;
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
  }
}
