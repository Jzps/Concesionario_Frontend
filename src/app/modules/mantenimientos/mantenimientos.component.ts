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
        console.log('Mantenimientos cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos:', err);
        this.showMessageModal('Error al cargar los mantenimientos.');
      },
    });
  }

  filtrarMantenimientos(): void {
    const term = this.filtro.toLowerCase().trim();
    if (!term) {
      this.cargarMantenimientos();
      return;
    }
    this.mantenimientos = this.mantenimientos.filter(
      (m) =>
        m.id?.toLowerCase().includes(term) ||
        m.auto_id.toLowerCase().includes(term) ||
        (m as any).detalle?.toLowerCase().includes(term)
    );
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

    const formData = this.mantenimientoForm.getRawValue();
    const nuevoMantenimiento: Mantenimiento = {
      descripcion: formData.detalle,
      fecha: formData.fecha,
      costo: formData.costo,
      empleado_id: formData.empleado_id,
      auto_id: formData.auto_id,
    };

    this.mantenimientoService.crearMantenimiento(nuevoMantenimiento).subscribe({
      next: (response) => {
        console.log('Mantenimiento creado:', response);
        this.showMessageModal('Mantenimiento registrado exitosamente.');
        this.cargarMantenimientos();
        this.mantenimientoForm.reset();
      },
      error: (err) => {
        console.error('Error al crear mantenimiento:', err);
        this.showMessageModal('Error al registrar el mantenimiento.');
      },
    });
  }

  eliminarMantenimiento(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este mantenimiento?')) return;

    this.mantenimientoService.eliminarMantenimiento(id).subscribe({
      next: () => {
        this.showMessageModal(
          `Mantenimiento con ID ${id} eliminado correctamente.`
        );
        this.cargarMantenimientos();
      },
      error: (err) => {
        console.error('Error al eliminar mantenimiento:', err);
        this.showMessageModal('Error al eliminar el mantenimiento.');
      },
    });
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }
}
