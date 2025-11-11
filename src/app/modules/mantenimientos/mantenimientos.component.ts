import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Mantenimiento,
  MantenimientoService,
} from '../../services/mantenimientos.service';

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

  mantenimientos: Mantenimiento[] = [];
  filteredMantenimientos: Mantenimiento[] = [];

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService
  ) {}

  ngOnInit(): void {
    this.mantenimientoForm = this.fb.group({
      auto_id: ['', Validators.required],
      empleado_id: ['', Validators.required],
      cliente_id: ['', Validators.required],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      detalle: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
    });

    this.cargarMantenimientos();
  }

  cargarMantenimientos(): void {
    this.mantenimientoService.listarMantenimientos().subscribe({
      next: (data) => {
        this.mantenimientos = data;
        this.filteredMantenimientos = [...data];
      },
      error: () => {
        this.showMessageModal('Error al cargar los mantenimientos.');
      },
    });
  }

  filtrarMantenimientos(): void {
    const term = this.filtro.toLowerCase().trim();

    this.filteredMantenimientos = term
      ? this.mantenimientos.filter(
          (m) =>
            m.id?.toLowerCase().includes(term) ||
            m.auto_id.toLowerCase().includes(term) ||
            m.detalle.toLowerCase().includes(term)
        )
      : [...this.mantenimientos];
  }

  crearMantenimiento(): void {
    this.mantenimientoForm.reset({
      fecha: new Date().toISOString().split('T')[0],
      costo: 0,
    });
  }

  guardarMantenimiento(): void {
    if (this.mantenimientoForm.invalid) {
      this.mantenimientoForm.markAllAsTouched();
      return;
    }

    const data = this.mantenimientoForm.getRawValue();

    const nuevoMantenimiento: Mantenimiento = {
      detalle: data.detalle,
      fecha: data.fecha,
      costo: data.costo,
      empleado_id: data.empleado_id,
      auto_id: data.auto_id,
      cliente_id: data.cliente_id,
    };

    this.mantenimientoService.crearMantenimiento(nuevoMantenimiento).subscribe({
      next: () => {
        this.showMessageModal('Mantenimiento registrado exitosamente.');
        this.cargarMantenimientos();
        this.mantenimientoForm.reset({
          fecha: new Date().toISOString().split('T')[0],
          costo: 0,
        });
      },
      error: () => {
        this.showMessageModal('Error al registrar el mantenimiento.');
      },
    });
  }

  pedirConfirmacion(id: string): void {
    this.mantenimientoIdToDelete = id;
    const modal = document.getElementById('confirmModal');
    if (modal) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }

  confirmarEliminar(): void {
    if (!this.mantenimientoIdToDelete) return;

    this.mantenimientoService
      .eliminarMantenimiento(this.mantenimientoIdToDelete)
      .subscribe({
        next: () => {
          this.showMessageModal('Mantenimiento eliminado correctamente.');
          this.cargarMantenimientos();
        },
        error: () => {
          this.showMessageModal('Error al eliminar el mantenimiento.');
        },
      });

    this.mantenimientoIdToDelete = null;
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    const modal = document.getElementById('messageModal');
    if (modal) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }
}
