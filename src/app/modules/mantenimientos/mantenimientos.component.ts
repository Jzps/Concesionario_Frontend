import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Mantenimiento {
  id: string;
  auto_id: string;
  empleado_id: string;
  cliente_id: string;
  fecha: string;
  detalle: string;
  costo: number;
}

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class MantenimientosComponent implements OnInit {
  filtro = '';
  mantenimientoForm!: FormGroup;
  messageModalText: string = '';
  mantenimientoIdToDelete: string | null = null;

  mantenimientos: Mantenimiento[] = [
    {
      id: 'M101',
      auto_id: 'XYZ123',
      empleado_id: 'E001',
      cliente_id: 'C001',
      fecha: '2025-10-01',
      detalle: 'Cambio de aceite y filtros',
      costo: 350000,
    },
    {
      id: 'M102',
      auto_id: 'ABC456',
      empleado_id: 'E002',
      cliente_id: 'C002',
      fecha: '2025-10-15',
      detalle: 'Revisión de frenos',
      costo: 0,
    },
    {
      id: 'M103',
      auto_id: 'KLM789',
      empleado_id: 'E003',
      cliente_id: 'C003',
      fecha: '2025-10-18',
      detalle: 'Diagnóstico de motor',
      costo: 0,
    },
  ];

  filteredMantenimientos: Mantenimiento[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mantenimientoForm = this.fb.group({
      auto_id: ['', Validators.required],
      empleado_id: ['', Validators.required],
      cliente_id: ['', Validators.required],
      fecha: ['', Validators.required],
      detalle: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
    });

    this.filteredMantenimientos = [...this.mantenimientos];
  }

  filtrarMantenimientos() {
    const term = this.filtro.toLowerCase().trim();
    this.filteredMantenimientos = !term
      ? [...this.mantenimientos]
      : this.mantenimientos.filter(
          (m) =>
            m.id.toLowerCase().includes(term) ||
            m.auto_id.toLowerCase().includes(term)
        );
  }

  private getNextId(): string {
    const maxId = this.mantenimientos.reduce((max, m) => {
      const num = parseInt(m.id.replace('M', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 100);
    return `M${maxId + 1}`;
  }

  crearMantenimiento() {
    this.mantenimientoForm.reset({
      fecha: new Date().toISOString().split('T')[0],
      costo: 0,
    });
  }

  guardarMantenimiento() {
    if (this.mantenimientoForm.valid) {
      const nuevoMantenimiento: Mantenimiento = {
        id: this.getNextId(),
        ...this.mantenimientoForm.getRawValue(),
      };
      this.mantenimientos.push(nuevoMantenimiento);
      this.filtrarMantenimientos();
      this.showMessageModal('Mantenimiento creado exitosamente.');
      this.mantenimientoForm.reset();
    } else {
      this.mantenimientoForm.markAllAsTouched();
    }
  }

  eliminarMantenimiento(id: string) {
    this.mantenimientoIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.mantenimientoIdToDelete) {
      this.mantenimientos = this.mantenimientos.filter(
        (m) => m.id !== this.mantenimientoIdToDelete
      );
      this.filtrarMantenimientos();
      this.showMessageModal(
        `Mantenimiento con ID ${this.mantenimientoIdToDelete} eliminado.`
      );
      this.mantenimientoIdToDelete = null;
    }
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }

  private showConfirmModal(): void {
    console.log(
      `[Confirm Modal] Solicitud de eliminación para ${this.mantenimientoIdToDelete}`
    );
  }
}
