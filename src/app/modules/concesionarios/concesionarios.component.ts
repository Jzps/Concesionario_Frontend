import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Concesionario {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

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

  concesionarios: Concesionario[] = [
    {
      id: '1',
      nombre: 'AutoCentro Principal',
      direccion: 'Av. Libertador #10-50',
      telefono: '6015551234',
    },
    {
      id: '2',
      nombre: 'Ruedas del Sur',
      direccion: 'Calle 25 #5-10',
      telefono: '6045555678',
    },
  ];

  filteredConcesionarios: Concesionario[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.concesionarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    this.filteredConcesionarios = [...this.concesionarios];
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

  private getNextId(): string {
    const maxId = this.concesionarios.reduce((max, c) => {
      const idNum = parseInt(c.id, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    return (maxId + 1).toString();
  }

  crearConcesionario() {
    this.concesionarioForm.reset();
  }

  guardarConcesionario() {
    if (this.concesionarioForm.valid) {
      const nuevoConcesionario: Concesionario = {
        id: this.getNextId(),
        ...this.concesionarioForm.value,
      };
      this.concesionarios.push(nuevoConcesionario);
      this.filtrarConcesionarios();
      this.showMessageModal('Concesionario creado exitosamente.');
      this.concesionarioForm.reset();
    } else {
      this.concesionarioForm.markAllAsTouched();
    }
  }

  editarConcesionario(id: string) {
    this.showMessageModal(
      `Función de edición pendiente para el concesionario con ID: ${id}`
    );
  }

  eliminarConcesionario(id: string) {
    this.concesionarioIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.concesionarioIdToDelete) {
      this.concesionarios = this.concesionarios.filter(
        (c) => c.id !== this.concesionarioIdToDelete
      );
      this.filtrarConcesionarios();
      this.showMessageModal(
        `Concesionario con ID ${this.concesionarioIdToDelete} eliminado.`
      );
      this.concesionarioIdToDelete = null;
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
