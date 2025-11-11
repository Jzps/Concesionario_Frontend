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

declare var bootstrap: any;

@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autos.component.html',
  styleUrls: ['./autos.component.scss'],
})
export class AutosComponent implements OnInit {
  filtro = '';
  mostrandoVendidos = false;
  autoForm!: FormGroup;
  messageModalText: string = '';
  autoIdToDelete: string | null = null;

  autoEditandoId: string | null = null;

  autos: Auto[] = [];

  constructor(private fb: FormBuilder, private autosService: AutosService) {}

  ngOnInit(): void {
    this.autoForm = this.fb.group({
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      kilometraje: [null],
      autonomia: [null],
    });

    this.cargarAutos();
  }

  get autosMostrados(): Auto[] {
    return this.autos.filter(
      (a) => a.estado === (this.mostrandoVendidos ? 'VENDIDO' : 'DISPONIBLE')
    );
  }

  alternarVista() {
    this.mostrandoVendidos = !this.mostrandoVendidos;
    this.cargarAutos();
  }

  cargarAutos() {
    const request = this.mostrandoVendidos
      ? this.autosService.listarAutosVendidos()
      : this.autosService.listarAutos();

    request.subscribe({
      next: (data: any[]) => {
        this.autos = data.map((auto) => ({
          id: auto.id,
          tipo: auto.tipo,
          marca: auto.marca,
          modelo: auto.modelo,
          precio: auto.precio,
          kilometraje:
            auto.tipo.toLowerCase().includes('usado') &&
            auto.kilometraje !== null
              ? Number(auto.kilometraje)
              : null,
          autonomia:
            auto.tipo.toLowerCase().includes('electrico') &&
            auto.autonomia !== null
              ? Number(auto.autonomia)
              : null,
          estado: auto.vendido ? 'VENDIDO' : 'DISPONIBLE',
        }));
      },
      error: () => this.showMessageModal('Error cargando autos'),
    });
  }

  crearAuto() {
    this.autoEditandoId = null;
    this.autoForm.reset();
  }

  editarAuto(auto: Auto) {
    this.autoEditandoId = auto.id ?? null;

    this.autoForm.patchValue({
      tipo: auto.tipo,
      marca: auto.marca,
      modelo: auto.modelo,
      precio: auto.precio,
      kilometraje: auto.kilometraje,
      autonomia: auto.autonomia,
    });
  }

  guardarAuto() {
    if (!this.autoForm.valid) return;

    const { tipo, marca, modelo, precio, kilometraje, autonomia } =
      this.autoForm.value;

    if (this.autoEditandoId) {
      this.autosService
        .actualizarAuto(this.autoEditandoId, {
          tipo,
          marca,
          modelo,
          precio,
          kilometraje,
          autonomia,
        })
        .subscribe({
          next: () => {
            this.showMessageModal('Auto actualizado exitosamente.');
            this.cargarAutos();
          },
          error: () => this.showMessageModal('Error al actualizar el auto.'),
        });
    } else {
      this.autosService
        .comprarAuto(tipo, marca, modelo, precio, kilometraje, autonomia)
        .subscribe({
          next: () => {
            this.showMessageModal('Auto agregado exitosamente.');
            this.cargarAutos();
          },
          error: () => this.showMessageModal('Error al registrar el auto.'),
        });
    }
  }

  venderAuto(id: string) {
    this.autosService.venderAuto(id).subscribe({
      next: () => {
        this.showMessageModal('Auto vendido correctamente.');
        this.cargarAutos();
      },
      error: () => this.showMessageModal('Error al vender el auto.'),
    });
  }

  eliminarAuto(id: string) {
    this.autoIdToDelete = id;
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }

  confirmarEliminar() {
    if (!this.autoIdToDelete) return;

    this.autosService.eliminarAuto(this.autoIdToDelete).subscribe({
      next: () => {
        this.showMessageModal('Auto eliminado con éxito.');
        this.cargarAutos();
      },
      error: () => this.showMessageModal('Error al eliminar auto.'),
    });
  }

  private showMessageModal(message: string) {
    this.messageModalText = message;
    new bootstrap.Modal(document.getElementById('messageModal')).show();
  }
}
