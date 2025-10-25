import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Auto {
  id: string;
  name: string;
  description: string;
  tipo: string;
  marca: string;
  modelo: string;
  precio: number;
  kilometraje?: number | null;
  autonomia?: number | null;
  estado: 'DISPONIBLE' | 'VENDIDO';
}

@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autos.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class AutosComponent implements OnInit {
  filtro = '';
  mostrandoVendidos = false;
  autoForm!: FormGroup;
  messageModalText: string = '';
  autoIdToDelete: string | null = null;

  todosLosAutos: Auto[] = [
    {
      id: 'A1',
      name: 'Sedán Familiar',
      description: 'Vehículo cómodo para ciudad',
      tipo: 'Sedán',
      marca: 'Toyota',
      modelo: 'Corolla',
      precio: 85000000,
      kilometraje: 15000,
      autonomia: 500,
      estado: 'DISPONIBLE',
    },
    {
      id: 'A2',
      name: 'SUV Premium',
      description: 'Amplio y potente',
      tipo: 'SUV',
      marca: 'Nissan',
      modelo: 'X-Trail',
      precio: 125000000,
      kilometraje: 22000,
      autonomia: 600,
      estado: 'VENDIDO',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.autoForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      kilometraje: [null, [Validators.min(0)]],
      autonomia: [null, [Validators.min(0)]],
    });
  }

  get autosMostrados(): Auto[] {
    return this.todosLosAutos.filter(
      (a) => a.estado === (this.mostrandoVendidos ? 'VENDIDO' : 'DISPONIBLE')
    );
  }

  private getNextId(): string {
    const maxId = this.todosLosAutos.reduce((max, auto) => {
      const num = parseInt(auto.id.replace('A', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `A${maxId + 1}`;
  }

  crearAuto() {
    this.autoForm.reset();
  }

  guardarAuto() {
    if (this.autoForm.valid) {
      const nuevoAuto: Auto = {
        id: this.getNextId(),
        ...this.autoForm.value,
        estado: 'DISPONIBLE',
      };

      this.todosLosAutos.push(nuevoAuto);
      this.showMessageModal('Auto agregado exitosamente al inventario.');
      this.autoForm.reset();
    } else {
      this.autoForm.markAllAsTouched();
    }
  }

  venderAuto(id: string) {
    const auto = this.todosLosAutos.find((a) => a.id === id);
    if (auto) {
      auto.estado = 'VENDIDO';
      this.showMessageModal(
        `El auto ${auto.name} ha sido marcado como VENDIDO.`
      );
    }
  }

  eliminarAuto(id: string) {
    this.autoIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.autoIdToDelete) {
      this.todosLosAutos = this.todosLosAutos.filter(
        (a) => a.id !== this.autoIdToDelete
      );
      this.showMessageModal(
        `Auto con ID ${this.autoIdToDelete} eliminado del sistema.`
      );
      this.autoIdToDelete = null;
    }
  }

  alternarVista() {
    this.mostrandoVendidos = !this.mostrandoVendidos;
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }

  private showConfirmModal(): void {
    console.log(
      `[Confirm Modal] Solicitud de eliminación para ${this.autoIdToDelete}`
    );
  }
}
