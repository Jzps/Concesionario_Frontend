import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Factura {
  id: string;
  fecha_emision: string;
  cliente_id: string;
  empleado_id: string;
  auto_id: string;
  precio_carro_base: number;
  costo_mantenimiento: number;
  descuento: number;
  total: number;
  observaciones: string;
}

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

  facturas: Factura[] = [
    {
      id: '1',
      fecha_emision: '2025-10-10',
      cliente_id: '1',
      empleado_id: '1',
      auto_id: '1',
      precio_carro_base: 1500000,
      costo_mantenimiento: 100000,
      descuento: 50000,
      total: 1550000,
      observaciones: 'Factura pagada en efectivo.',
    },
    {
      id: '2',
      fecha_emision: '2025-10-15',
      cliente_id: '2',
      empleado_id: '3',
      auto_id: '2',
      precio_carro_base: 800000,
      costo_mantenimiento: 50000,
      descuento: 0,
      total: 850000,
      observaciones: 'Pendiente de pago.',
    },
  ];

  filteredFacturas: Factura[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.facturaForm = this.fb.group({
      fecha_emision: ['', Validators.required],
      cliente_id: ['', Validators.required],
      empleado_id: ['', Validators.required],
      auto_id: ['', Validators.required],
      precio_carro_base: [0, [Validators.required, Validators.min(0)]],
      costo_mantenimiento: [0, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
      observaciones: [''],
    });

    this.filteredFacturas = [...this.facturas];

    this.facturaForm.valueChanges.subscribe(() => this.calcularTotal());
  }

  filtrarFacturas() {
    const term = this.filtro.toLowerCase().trim();
    this.filteredFacturas = !term
      ? [...this.facturas]
      : this.facturas.filter(
          (f) =>
            f.id.includes(term) || f.observaciones.toLowerCase().includes(term)
        );
  }

  private getNextId(): string {
    const maxId = this.facturas.reduce((max, f) => {
      const idNum = parseInt(f.id, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    return (maxId + 1).toString();
  }

  crearFactura() {
    this.facturaForm.reset();
    this.facturaForm.patchValue({
      fecha_emision: new Date().toISOString().split('T')[0],
      precio_carro_base: 0,
      costo_mantenimiento: 0,
      descuento: 0,
      total: 0,
    });
  }

  guardarFactura() {
    if (this.facturaForm.valid) {
      const nuevaFactura: Factura = {
        id: this.getNextId(),
        ...this.facturaForm.getRawValue(),
      };
      this.facturas.push(nuevaFactura);
      this.filtrarFacturas();
      this.showMessageModal('Factura creada exitosamente.');
      this.facturaForm.reset();
    } else {
      this.facturaForm.markAllAsTouched();
    }
  }

  calcularTotal() {
    const { precio_carro_base, costo_mantenimiento, descuento } =
      this.facturaForm.getRawValue();
    const total =
      (precio_carro_base || 0) + (costo_mantenimiento || 0) - (descuento || 0);
    this.facturaForm.patchValue({ total }, { emitEvent: false });
  }

  eliminarFactura(id: string) {
    this.facturaIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.facturaIdToDelete) {
      this.facturas = this.facturas.filter(
        (f) => f.id !== this.facturaIdToDelete
      );
      this.filtrarFacturas();
      this.showMessageModal(
        `Factura con ID ${this.facturaIdToDelete} eliminada.`
      );
      this.facturaIdToDelete = null;
    }
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }

  private showConfirmModal(): void {
    console.log(
      `[Confirm Modal] Solicitud de eliminación para ${this.facturaIdToDelete}`
    );
  }
}
