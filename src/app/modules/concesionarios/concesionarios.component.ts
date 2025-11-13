import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Concesionario,
  ConcesionarioService,
} from '../../services/concesionario.service';

declare var bootstrap: any;

@Component({
  selector: 'app-concesionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './concesionarios.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class ConcesionariosComponent implements OnInit {
  filtro = '';
  concesionarioForm!: FormGroup;
  messageModalText: string = '';

  concesionarioIdEdit: string | null = null;
  concesionarioIdDelete: string | null = null;

  concesionarios: Concesionario[] = [];
  filteredConcesionarios: Concesionario[] = [];

  constructor(
    private fb: FormBuilder,
    private concesionarioService: ConcesionarioService
  ) {}

  /**
   * Inicializa el formulario de concesionarios y carga la lista inicial.
   */
  ngOnInit(): void {
    this.concesionarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    this.cargarConcesionarios();
  }

  /**
   * Carga todos los concesionarios desde el servicio.
   * Actualiza las listas locales de concesionarios.
   */
  cargarConcesionarios() {
    this.concesionarioService.listarConcesionarios().subscribe({
      next: (data) => {
        this.concesionarios = data;
        this.filteredConcesionarios = [...data];
      },
      error: () => this.showMessageModal('Error al cargar los concesionarios.'),
    });
  }

  /**
   * Filtra la lista de concesionarios según el término de búsqueda.
   */
  filtrarConcesionarios() {
    const term = this.filtro.toLowerCase().trim();
    this.filteredConcesionarios = !term
      ? [...this.concesionarios]
      : this.concesionarios.filter(
          (c) =>
            c.nombre.toLowerCase().includes(term) ||
            c.direccion.toLowerCase().includes(term)
        );
  }

  /**
   * Prepara el formulario para crear un nuevo concesionario.
   * Limpia los campos y resetea el ID de edición.
   */
  crearConcesionario() {
    this.concesionarioForm.reset();
    this.concesionarioIdEdit = null;
  }

  /**
   * Carga los datos de un concesionario en el formulario para edición.
   * @param id ID del concesionario a editar.
   */
  editarConcesionario(id: string) {
    const concesionario = this.concesionarios.find((c) => c.id === id);
    if (!concesionario) return;

    this.concesionarioForm.patchValue(concesionario);
    this.concesionarioIdEdit = id;

    new bootstrap.Modal(document.getElementById('concesionarioModal')).show();
  }

  /**
   * Guarda los cambios del formulario.
   * Si hay un ID de edición, actualiza el concesionario; de lo contrario, crea uno nuevo.
   */
  guardarConcesionario() {
    if (!this.concesionarioForm.valid) {
      this.concesionarioForm.markAllAsTouched();
      return;
    }

    const data: Concesionario = this.concesionarioForm.value;

    if (this.concesionarioIdEdit) {
      this.concesionarioService
        .actualizarConcesionario(this.concesionarioIdEdit, data)
        .subscribe({
          next: () => {
            this.showMessageModal('Concesionario actualizado exitosamente.');
            this.cargarConcesionarios();
            this.cerrarFormulario();
          },
          error: () =>
            this.showMessageModal('Error al actualizar el concesionario.'),
        });
      return;
    }

    this.concesionarioService.crearConcesionario(data).subscribe({
      next: () => {
        this.showMessageModal('Concesionario creado con éxito.');
        this.cargarConcesionarios();
        this.cerrarFormulario();
      },
      error: () => this.showMessageModal('Error al crear el concesionario.'),
    });
  }

  /**
   * Abre el modal de confirmación para eliminar un concesionario.
   * @param id ID del concesionario a eliminar.
   */
  eliminarConcesionario(id: string) {
    this.concesionarioIdDelete = id;
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }

  /**
   * Confirma la eliminación del concesionario seleccionado.
   */
  confirmarEliminar() {
    if (!this.concesionarioIdDelete) return;

    this.concesionarioService
      .eliminarConcesionario(this.concesionarioIdDelete)
      .subscribe({
        next: () => {
          this.showMessageModal('Concesionario eliminado correctamente.');
          this.cargarConcesionarios();
          this.concesionarioIdDelete = null;
        },
        error: () =>
          this.showMessageModal('Error al eliminar el concesionario.'),
      });
  }

  /**
   * Cierra el modal de formulario y resetea los campos.
   */
  private cerrarFormulario() {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('concesionarioModal')
    );
    modal?.hide();
    this.concesionarioForm.reset();
    this.concesionarioIdEdit = null;
  }

  /**
   * Muestra un modal de mensaje con el texto proporcionado.
   * @param message Texto a mostrar en el modal.
   */
  private showMessageModal(message: string) {
    this.messageModalText = message;
    new bootstrap.Modal(document.getElementById('messageModal')).show();
  }
}
