import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Factura, FacturaService } from '../../services/facturas.service';

declare var bootstrap: any;

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './facturas.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class FacturasComponent implements OnInit {
  filtro = '';
  facturaForm!: FormGroup;
  messageModalText: string = '';
  facturaIdToDelete: string | null = null;

  facturas: Factura[] = [];
  filteredFacturas: Factura[] = [];

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.facturaForm = this.fb.group({
      fecha_emision: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      cliente_id: ['', Validators.required],
      empleado_id: ['', Validators.required],
      auto_id: ['', Validators.required],
      precio_carro_base: [0, [Validators.required, Validators.min(0)]],
      costo_mantenimiento: [0, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
      observaciones: [''],
    });

    this.facturaForm.valueChanges.subscribe(() => this.calcularTotal());
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.facturaService.listarFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.filteredFacturas = [...this.facturas];
        console.log('Facturas cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar facturas:', err);
        this.showMessageModal('Error al cargar las facturas.');
      },
    });
  }

  filtrarFacturas(): void {
    const term = this.filtro.toLowerCase().trim();
    if (!term) {
      this.filteredFacturas = [...this.facturas];
      return;
    }
    this.filteredFacturas = this.facturas.filter(
      (f) =>
        f.id?.toString().includes(term) ||
        (f as any).observaciones?.toLowerCase().includes(term)
    );
  }

  crearFactura(): void {
    this.facturaForm.reset({
      fecha_emision: new Date().toISOString().split('T')[0],
      cliente_id: '',
      empleado_id: '',
      auto_id: '',
      precio_carro_base: 0,
      costo_mantenimiento: 0,
      descuento: 0,
      total: 0,
      observaciones: '',
    });
  }

  guardarFactura(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    const raw = this.facturaForm.getRawValue();

    const cliente_id = (raw.cliente_id || '').toString().trim();
    const empleado_id = (raw.empleado_id || '').toString().trim();
    const auto_id = (raw.auto_id || '').toString().trim();

    const nuevoPayload: Factura = {
      fecha_emision: raw.fecha_emision,
      cliente_id,
      empleado_id,
      auto_id,
      precio_carro_base: Number(raw.precio_carro_base) || 0,
      costo_mantenimiento: Number(raw.costo_mantenimiento) || 0,
      descuento: Number(raw.descuento) || 0,
      total: Number(raw.total) || 0,
      observaciones: raw.observaciones || '',
    };

    console.log('POST /facturas payload ->', nuevoPayload);

    this.facturaService.crearFactura(nuevoPayload).subscribe({
      next: (facturaCreada) => {
        console.log('Factura creada:', facturaCreada);
        this.showMessageModal('Factura creada exitosamente.');
        this.cargarFacturas();
        // cerrar modal si está abierto
        bootstrap.Modal.getInstance(
          document.getElementById('facturaModal')
        )?.hide();
        this.facturaForm.reset({
          fecha_emision: new Date().toISOString().split('T')[0],
          precio_carro_base: 0,
          costo_mantenimiento: 0,
          descuento: 0,
          total: 0,
          observaciones: '',
        });
      },
      error: (err) => {
        console.error('Error al crear factura:', err);
        const detalle = err?.error?.detail;
        if (detalle) {
          this.showMessageModal(
            'Error al crear la factura. Revisa los campos: ' +
              JSON.stringify(detalle)
          );
        } else {
          this.showMessageModal('Error al crear la factura.');
        }
      },
    });
  }

  calcularTotal(): void {
    const raw = this.facturaForm.getRawValue();
    const precio = Number(raw.precio_carro_base) || 0;
    const mant = Number(raw.costo_mantenimiento) || 0;
    const desc = Number(raw.descuento) || 0;
    const total = precio + mant - desc;
    this.facturaForm.patchValue(
      { total: total >= 0 ? total : 0 },
      { emitEvent: false }
    );
  }

  eliminarFactura(id: string): void {
    this.facturaIdToDelete = id;
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }

  confirmarEliminar(): void {
    if (!this.facturaIdToDelete) return;

    this.facturaService.eliminarFactura(this.facturaIdToDelete).subscribe({
      next: () => {
        this.showMessageModal(
          `Factura con ID ${this.facturaIdToDelete} eliminada correctamente.`
        );
        this.cargarFacturas();
        this.facturaIdToDelete = null;
      },
      error: (err) => {
        console.error('Error al eliminar factura:', err);
        this.showMessageModal('Error al eliminar la factura.');
      },
    });
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    new bootstrap.Modal(document.getElementById('messageModal')).show();
  }
}
