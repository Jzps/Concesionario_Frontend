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
  filteredFacturas: any[] = [];

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

    const formData = this.facturaForm.getRawValue();
    const nuevaFactura: Factura = {
      fecha_emision: formData.fecha_emision,
      cliente_id: formData.cliente_id,
      empleado_id: formData.empleado_id,
      auto_id: formData.auto_id,
      total: formData.total,
    };

    this.facturaService.crearFactura(nuevaFactura).subscribe({
      next: (facturaCreada) => {
        console.log('Factura creada:', facturaCreada);
        this.showMessageModal('Factura creada exitosamente.');
        this.cargarFacturas();
        this.facturaForm.reset();
      },
      error: (err) => {
        console.error('Error al crear factura:', err);
        this.showMessageModal('Error al crear la factura.');
      },
    });
  }

  calcularTotal(): void {
    const { precio_carro_base, costo_mantenimiento, descuento } =
      this.facturaForm.getRawValue();
    const total =
      (precio_carro_base || 0) + (costo_mantenimiento || 0) - (descuento || 0);
    this.facturaForm.patchValue({ total }, { emitEvent: false });
  }

  eliminarFactura(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar esta factura?')) return;

    this.facturaService.eliminarFactura(id).subscribe({
      next: () => {
        this.showMessageModal(`Factura con ID ${id} eliminada correctamente.`);
        this.cargarFacturas();
      },
      error: (err) => {
        console.error('Error al eliminar factura:', err);
        this.showMessageModal('Error al eliminar la factura.');
      },
    });
  }

  confirmarEliminar(): void {
    console.log('Confirmar eliminar (por implementar)');
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }
}
