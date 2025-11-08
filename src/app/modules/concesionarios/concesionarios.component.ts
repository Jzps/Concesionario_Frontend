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

  ngOnInit(): void {
    this.concesionarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    this.cargarConcesionarios();
  }

  cargarConcesionarios() {
    this.concesionarioService.listarConcesionarios().subscribe({
      next: (data) => {
        this.concesionarios = data;
        this.filteredConcesionarios = [...data];
      },
      error: () => this.showMessageModal('Error al cargar los concesionarios.'),
    });
  }

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

  crearConcesionario() {
    this.concesionarioForm.reset();
    this.concesionarioIdEdit = null;
  }

  editarConcesionario(id: string) {
    const concesionario = this.concesionarios.find((c) => c.id === id);
    if (!concesionario) return;

    this.concesionarioForm.patchValue(concesionario);
    this.concesionarioIdEdit = id;

    // ABRIR MODAL AUTOMÁTICAMENTE
    new bootstrap.Modal(document.getElementById('concesionarioModal')).show();
  }

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

  eliminarConcesionario(id: string) {
    this.concesionarioIdDelete = id;
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }

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

  private cerrarFormulario() {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('concesionarioModal')
    );
    modal?.hide();
    this.concesionarioForm.reset();
    this.concesionarioIdEdit = null;
  }

  private showMessageModal(message: string) {
    this.messageModalText = message;
    new bootstrap.Modal(document.getElementById('messageModal')).show();
  }
}
