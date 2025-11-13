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
  // Filtro de búsqueda
  filtro = '';
  // Formulario reactivo para crear o editar mantenimientos
  mantenimientoForm!: FormGroup;
  // Texto del mensaje del modal
  messageModalText: string = '';
  // ID del mantenimiento a eliminar
  mantenimientoIdToDelete: string | null = null;

  // Listado general de mantenimientos
  mantenimientos: Mantenimiento[] = [];
  // Lista filtrada de mantenimientos
  filteredMantenimientos: Mantenimiento[] = [];

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService
  ) {}

  // Inicializa el formulario y carga los mantenimientos
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

  // Carga la lista de mantenimientos desde el servicio
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

  // Filtra los mantenimientos según el texto ingresado
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

  // Limpia el formulario para crear un nuevo mantenimiento
  crearMantenimiento(): void {
    this.mantenimientoForm.reset({
      fecha: new Date().toISOString().split('T')[0],
      costo: 0,
    });
  }

  // Guarda un mantenimiento nuevo a través del servicio
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

  // Abre un modal de confirmación antes de eliminar un mantenimiento
  pedirConfirmacion(id: string): void {
    this.mantenimientoIdToDelete = id;
    const modal = document.getElementById('confirmModal');
    if (modal) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }

  // Confirma la eliminación del mantenimiento seleccionado
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

  // Muestra un modal con un mensaje determinado
  private showMessageModal(message: string): void {
    this.messageModalText = message;
    const modal = document.getElementById('messageModal');
    if (modal) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }
}
