import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auto, AutosService } from '../../services/autos.service';

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

  todosLosAutos: Auto[] = [];

  constructor(private fb: FormBuilder, private autosService: AutosService) {}

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

    this.cargarAutos();
  }

  crearAuto() {
    this.autoForm.reset();
  }

  get autosMostrados(): Auto[] {
    return this.todosLosAutos.filter(
      (a) => a.estado === (this.mostrandoVendidos ? 'VENDIDO' : 'DISPONIBLE')
    );
  }

  cargarAutos() {
    const request = this.mostrandoVendidos
      ? this.autosService.listarAutosVendidos()
      : this.autosService.listarAutos();

    request.subscribe({
      next: (data) => {
        this.todosLosAutos = data.map((auto) => ({
          id: auto.id ?? '',
          name: `${auto.marca} ${auto.modelo}`,
          description: '',
          tipo: auto.tipo ?? 'Desconocido',
          marca: auto.marca,
          modelo: auto.modelo,
          precio: auto.precio,
          kilometraje: auto.kilometraje,
          autonomia: auto.autonomia,
          estado:
            auto.estado?.toUpperCase() === 'VENDIDO' ? 'VENDIDO' : 'DISPONIBLE',
        }));
        console.log('Autos cargados:', this.todosLosAutos);
      },
      error: (err) => {
        console.error('Error al obtener autos:', err);
        this.showMessageModal('Error al cargar los autos desde la API.');
      },
    });
  }

  guardarAuto() {
    if (this.autoForm.valid) {
      const { tipo, marca, modelo, precio, kilometraje, autonomia } =
        this.autoForm.value;

      this.autosService
        .comprarAuto(tipo, marca, modelo, precio, kilometraje, autonomia)
        .subscribe({
          next: () => {
            this.showMessageModal('Auto agregado exitosamente al inventario.');
            this.cargarAutos();
            this.autoForm.reset();
          },
          error: (err) => {
            console.error('Error al agregar auto:', err);
            this.showMessageModal('Error al registrar el auto.');
          },
        });
    } else {
      this.autoForm.markAllAsTouched();
    }
  }

  venderAuto(id: string) {
    this.autosService.venderAuto(id).subscribe({
      next: () => {
        this.showMessageModal('El auto ha sido marcado como vendido.');
        this.cargarAutos();
      },
      error: (err) => {
        console.error('Error al vender auto:', err);
        this.showMessageModal('Error al vender el auto.');
      },
    });
  }

  confirmarEliminar() {
    if (this.autoIdToDelete) {
      this.autosService.eliminarAuto(this.autoIdToDelete).subscribe({
        next: () => {
          this.showMessageModal(
            `Auto con ID ${this.autoIdToDelete} eliminado del sistema.`
          );
          this.cargarAutos();
          this.autoIdToDelete = null;
        },
        error: (err) => {
          console.error('Error al eliminar auto:', err);
          this.showMessageModal('Error al eliminar el auto.');
        },
      });
    }
  }

  eliminarAuto(id: string) {
    this.autoIdToDelete = id;
    this.showConfirmModal();
  }

  alternarVista() {
    this.mostrandoVendidos = !this.mostrandoVendidos;
    this.cargarAutos();
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
