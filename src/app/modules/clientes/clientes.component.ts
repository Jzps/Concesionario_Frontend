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

/**
 * Componente encargado de la gestión de clientes.
 * Permite crear, editar, eliminar y filtrar clientes registrados.
 */
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  /** Texto del filtro de búsqueda */
  filtro = '';
  /** Formulario reactivo para creación y edición de clientes */
  clienteForm!: FormGroup;
  /** Texto del mensaje mostrado en los modales */
  messageModalText = '';
  /** ID del cliente que será eliminado */
  clienteIdToDelete: string | null = null;
  /** Lista total de clientes */
  clientes: Cliente[] = [];
  /** Lista filtrada de clientes mostrados en la tabla */
  filteredClientes: Cliente[] = [];
  /** Indica si se está en modo edición */
  modoEdicion = false;
  /** ID del cliente actualmente en edición */
  clienteEditandoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {}

  /**
   * Inicializa el formulario y carga la lista de clientes al iniciar el componente.
   */
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

  /**
   * Obtiene la lista completa de clientes desde el servicio.
   * Actualiza la lista filtrada para mostrar los datos.
   */
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

  /**
   * Filtra la lista de clientes según el término de búsqueda.
   */
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

  /**
   * Abre el modal para crear un nuevo cliente.
   * Reinicia el formulario y cambia el modo a creación.
   */
  crearCliente() {
    this.modoEdicion = false;
    this.clienteForm.reset();

    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
  }

  /**
   * Guarda un nuevo cliente o actualiza uno existente según el modo actual.
   */
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

  /**
   * Carga los datos de un cliente existente para editarlo.
   * @param id ID del cliente a editar.
   */
  editarCliente(id: string) {
    this.modoEdicion = true;
    this.clienteEditandoId = id;

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

  /**
   * Abre el modal de confirmación para eliminar un cliente.
   * @param id ID del cliente a eliminar.
   */
  eliminarCliente(id: string) {
    this.clienteIdToDelete = id;

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
  }

  /**
   * Confirma la eliminación del cliente seleccionado y actualiza la lista.
   */
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

  /**
   * Muestra un modal con un mensaje informativo.
   * @param message Texto del mensaje a mostrar.
   */
  showMessageModal(message: string) {
    this.messageModalText = message;
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
  }
}
