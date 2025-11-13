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

/**
 * Componente encargado de gestionar el módulo de autos.
 * Permite listar, crear, editar, vender y eliminar autos.
 */
@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autos.component.html',
  styleUrls: ['./autos.component.scss'],
})
export class AutosComponent implements OnInit {
  /** Texto del filtro de búsqueda */
  filtro = '';
  /** Indica si se están mostrando autos vendidos */
  mostrandoVendidos = false;
  /** Formulario reactivo de autos */
  autoForm!: FormGroup;
  /** Texto mostrado en el modal de mensajes */
  messageModalText: string = '';
  /** ID del auto que se va a eliminar */
  autoIdToDelete: string | null = null;
  /** ID del auto actualmente en edición */
  autoEditandoId: string | null = null;
  /** Lista de autos obtenidos del servicio */
  autos: Auto[] = [];

  constructor(private fb: FormBuilder, private autosService: AutosService) {}

  /**
   * Inicializa el componente y configura el formulario.
   * Carga la lista inicial de autos desde el servicio.
   */
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

  /** Obtiene los autos filtrados según el estado actual (vendidos o disponibles). */
  get autosMostrados(): Auto[] {
    return this.autos.filter(
      (a) => a.estado === (this.mostrandoVendidos ? 'VENDIDO' : 'DISPONIBLE')
    );
  }

  /** Alterna entre la vista de autos vendidos y disponibles. */
  alternarVista() {
    this.mostrandoVendidos = !this.mostrandoVendidos;
    this.cargarAutos();
  }

  /** Carga los autos desde el servicio, dependiendo del estado seleccionado. */
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

  /** Limpia el formulario para crear un nuevo auto. */
  crearAuto() {
    this.autoEditandoId = null;
    this.autoForm.reset();
  }

  /**
   * Carga los datos de un auto existente en el formulario para su edición.
   * @param auto Objeto del auto a editar.
   */
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

  /** Guarda un auto nuevo o actualiza uno existente. */
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

  /**
   * Marca un auto como vendido.
   * @param id ID del auto a vender.
   */
  venderAuto(id: string) {
    this.autosService.venderAuto(id).subscribe({
      next: () => {
        this.showMessageModal('Auto vendido correctamente.');
        this.cargarAutos();
      },
      error: () => this.showMessageModal('Error al vender el auto.'),
    });
  }

  /**
   * Abre el modal de confirmación para eliminar un auto.
   * @param id ID del auto a eliminar.
   */
  eliminarAuto(id: string) {
    this.autoIdToDelete = id;
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }

  /** Confirma y elimina el auto seleccionado. */
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

  /**
   * Muestra un modal con un mensaje informativo.
   * @param message Texto a mostrar en el modal.
   */
  private showMessageModal(message: string) {
    this.messageModalText = message;
    new bootstrap.Modal(document.getElementById('messageModal')).show();
  }
}
