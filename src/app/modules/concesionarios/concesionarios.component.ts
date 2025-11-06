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
  concesionarioIdToDelete: string | null = null;

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
        console.log('Concesionarios cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar concesionarios:', err);
        this.showMessageModal('Error al cargar los concesionarios.');
      },
    });
  }

  filtrarConcesionarios() {
    const term = this.filtro.toLowerCase().trim();
    if (!term) {
      this.filteredConcesionarios = [...this.concesionarios];
      return;
    }
    this.filteredConcesionarios = this.concesionarios.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        c.direccion.toLowerCase().includes(term)
    );
  }

  crearConcesionario() {
    this.concesionarioForm.reset();
    this.concesionarioIdToDelete = null;
  }

  guardarConcesionario() {
    if (this.concesionarioForm.valid) {
      const data: Concesionario = this.concesionarioForm.value;

      if (this.concesionarioIdToDelete) {
        this.concesionarioService
          .actualizarConcesionario(this.concesionarioIdToDelete, data)
          .subscribe({
            next: () => {
              this.showMessageModal('Concesionario actualizado exitosamente.');
              this.cargarConcesionarios();
              this.concesionarioForm.reset();
              this.concesionarioIdToDelete = null;
            },
            error: (err) => {
              console.error('Error al actualizar:', err);
              this.showMessageModal('Error al actualizar el concesionario.');
            },
          });
      } else {
        this.concesionarioService.crearConcesionario(data).subscribe({
          next: () => {
            this.showMessageModal('Concesionario creado exitosamente.');
            this.cargarConcesionarios();
            this.concesionarioForm.reset();
          },
          error: (err) => {
            console.error('Error al crear concesionario:', err);
            this.showMessageModal('Error al crear el concesionario.');
          },
        });
      }
    } else {
      this.concesionarioForm.markAllAsTouched();
    }
  }

  editarConcesionario(id: string) {
    const concesionario = this.concesionarios.find((c) => c.id === id);
    if (!concesionario) return;

    this.concesionarioForm.patchValue(concesionario);
    this.concesionarioIdToDelete = id;
    this.showMessageModal(
      `Editando concesionario con ID: ${id}. Modifica los campos y guarda.`
    );
  }

  eliminarConcesionario(id: string) {
    this.concesionarioIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.concesionarioIdToDelete) {
      this.concesionarioService
        .eliminarConcesionario(this.concesionarioIdToDelete)
        .subscribe({
          next: () => {
            this.showMessageModal(
              `Concesionario con ID ${this.concesionarioIdToDelete} eliminado.`
            );
            this.cargarConcesionarios();
            this.concesionarioIdToDelete = null;
          },
          error: (err) => {
            console.error('Error al eliminar concesionario:', err);
            this.showMessageModal('Error al eliminar el concesionario.');
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
      `[Confirm Modal] Solicitud de eliminación para ${this.concesionarioIdToDelete}`
    );
  }
}
